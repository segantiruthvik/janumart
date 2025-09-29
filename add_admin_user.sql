-- Add Admin User to User Table
-- Run this in Supabase SQL Editor

-- Insert Admin User into User table
INSERT INTO "User" ("id", "email", "name", "isAdmin", "createdAt", "updatedAt") 
VALUES (
    'admin-001',
    'janukishan@gmail.com',
    'JANU MART Admin',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("email") DO NOTHING;

-- Success message
SELECT 'Admin user added to User table successfully!' as status;
