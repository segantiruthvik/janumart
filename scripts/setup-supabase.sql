-- Supabase Database Setup Script
-- Run this in your Supabase SQL editor to set up the database schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The Prisma schema will handle table creation
-- This script is for any additional setup needed

-- Create admin user (you can modify the email and password)
INSERT INTO "User" (id, name, email, "isAdmin", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Admin User',
  'admin@example.com',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
