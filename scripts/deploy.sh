#!/bin/bash

# JANU ENTERPRISE Deployment Script

echo "🚀 Starting JANU ENTERPRISE deployment..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "🌐 Ready for deployment to Vercel"
