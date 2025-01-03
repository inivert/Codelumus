-- Enable RLS if not already enabled
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_tables
        WHERE tablename = 'users'
        AND rowsecurity = true
    ) THEN
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Add website column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'website'
    ) THEN
        ALTER TABLE users ADD COLUMN website VARCHAR(191);
        -- Add unique constraint separately to handle existing NULL values
        CREATE UNIQUE INDEX IF NOT EXISTS users_website_unique ON users (website) WHERE website IS NOT NULL;
    END IF;
END $$;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can update their own website" ON users;
    DROP POLICY IF EXISTS "Users can view their own website" ON users;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

-- Create RLS policies
CREATE POLICY "Users can update their own website"
    ON users
    FOR UPDATE
    USING (auth.uid()::text = id)
    WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can view their own website"
    ON users
    FOR SELECT
    USING (auth.uid()::text = id); 