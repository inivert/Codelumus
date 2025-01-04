-- Create the user_addons table if it doesn't exist
CREATE TABLE IF NOT EXISTS "user_addons" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addonId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripeSubscriptionItemId" TEXT,
    "stripePriceId" TEXT,

    CONSTRAINT "user_addons_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS "user_addons_stripeSubscriptionItemId_key" ON "user_addons"("stripeSubscriptionItemId");
CREATE UNIQUE INDEX IF NOT EXISTS "user_addons_userId_addonId_key" ON "user_addons"("userId", "addonId");
CREATE INDEX IF NOT EXISTS "user_addons_userId_idx" ON "user_addons"("userId");

-- Add foreign key constraint
ALTER TABLE "user_addons" ADD CONSTRAINT "user_addons_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- First, ensure we don't lose any active add-ons data
INSERT INTO "user_addons" ("id", "userId", "addonId", "active", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(), -- Generate a new UUID for the id
    id as "userId", -- Use the user's id
    unnest(COALESCE("activeAddons", ARRAY[]::text[])) as "addonId", -- Convert each array element into a row
    true as "active",
    NOW() as "createdAt",
    NOW() as "updatedAt"
FROM "users"
WHERE "activeAddons" IS NOT NULL
    AND NOT EXISTS ( -- Only insert if this addon doesn't already exist for this user
        SELECT 1 
        FROM "user_addons" ua 
        WHERE ua."userId" = "users"."id" 
        AND ua."addonId" = unnest(COALESCE("activeAddons", ARRAY[]::text[]))
    );

-- Now we can safely remove the activeAddons column
ALTER TABLE "users" DROP COLUMN IF EXISTS "activeAddons";

-- Remove any duplicate stripe fields if they exist
ALTER TABLE "users" DROP COLUMN IF EXISTS "stripe_customer_id_old";
ALTER TABLE "users" DROP COLUMN IF EXISTS "stripe_subscription_id_old";
ALTER TABLE "users" DROP COLUMN IF EXISTS "stripe_price_id_old";
ALTER TABLE "users" DROP COLUMN IF EXISTS "stripe_current_period_end_old"; 