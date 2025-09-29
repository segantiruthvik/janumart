-- Complete Database Setup for JANU MART
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Account table (for NextAuth)
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Session table (for NextAuth)
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create VerificationToken table (for NextAuth)
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("identifier", "token")
);

-- Create Offer table
CREATE TABLE IF NOT EXISTS "Offer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "discountPercentage" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "endTime" TEXT NOT NULL DEFAULT '23:59',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Product table
CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "pricePerGm" DECIMAL(10,4),
    "weight" DECIMAL(10,2),
    "weightUnit" TEXT,
    "image" TEXT,
    "company" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "offerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create Order table
CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "items" TEXT NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert Admin User
INSERT INTO "User" ("id", "email", "name", "isAdmin", "createdAt", "updatedAt") 
VALUES (
    'admin-001',
    'janukishan@gmail.com',
    'JANU MART Admin',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("email") DO NOTHING;

-- Insert Sample Offers
INSERT INTO "Offer" ("id", "name", "discountPercentage", "startDate", "endDate", "endTime", "isActive", "createdAt", "updatedAt") 
VALUES 
    ('offer-001', '5perm', 5, NOW(), NOW() + INTERVAL '5 years', '23:59', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('offer-002', '10perm', 10, NOW(), NOW() + INTERVAL '5 years', '23:59', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('offer-003', '15perm', 15, NOW(), NOW() + INTERVAL '5 years', '23:59', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('offer-004', '20perm', 20, NOW(), NOW() + INTERVAL '5 years', '23:59', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('offer-005', '25perm', 25, NOW(), NOW() + INTERVAL '5 years', '23:59', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('offer-006', '30perm', 30, NOW(), NOW() + INTERVAL '5 years', '23:59', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Insert Sample Products
INSERT INTO "Product" ("id", "name", "price", "pricePerGm", "weight", "weightUnit", "image", "company", "isAvailable", "order", "offerId", "createdAt", "updatedAt") 
VALUES 
    ('prod-001', 'Basmati Rice Premium', 450.00, 0.45, 1000, 'gm', '/uploads/basmati-rice.jpg', 'India Gate', true, 1, 'offer-001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('prod-002', 'Wheat Flour', 35.00, 0.035, 1000, 'gm', '/uploads/wheat-flour.jpg', 'Aashirvaad', true, 2, 'offer-002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "Product_company_idx" ON "Product"("company");
CREATE INDEX IF NOT EXISTS "Product_isAvailable_idx" ON "Product"("isAvailable");
CREATE INDEX IF NOT EXISTS "Product_order_idx" ON "Product"("order");
CREATE INDEX IF NOT EXISTS "Offer_isActive_idx" ON "Offer"("isActive");
CREATE INDEX IF NOT EXISTS "Account_userId_idx" ON "Account"("userId");
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");

-- Success message
SELECT 'Database setup completed successfully! Admin user and sample data added.' as status;
