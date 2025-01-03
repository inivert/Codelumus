-- Create user_analytics table
CREATE TABLE IF NOT EXISTS "user_analytics" (
    "id" VARCHAR(191) NOT NULL,
    "user_id" VARCHAR(191) NOT NULL,
    "umami_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_analytics_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint on user_id
CREATE UNIQUE INDEX "user_analytics_user_id_key" ON "user_analytics"("user_id");

-- Add foreign key constraint
ALTER TABLE "user_analytics" ADD CONSTRAINT "user_analytics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; 