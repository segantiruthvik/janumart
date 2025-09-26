# JANU ENTERPRISE - Food Distribution App

A modern, lightweight ordering website for JANU ENTERPRISE food distribution business. Built with Next.js 14, featuring a clean customer interface and a powerful admin dashboard.

## Features

### Customer Experience
- **No Registration Required**: Customers can browse and order immediately
- **Product Catalog**: Clean display of products with images, prices, and stock
- **Search Functionality**: Find products quickly by name, description, or brand
- **Shopping Cart**: Add items to cart with quantity management
- **WhatsApp Integration**: Orders are sent directly to WhatsApp for easy communication
- **Mobile-First Design**: Optimized for mobile devices

### Admin Features
- **Secure Authentication**: Password-protected admin access
- **Product Management**: Add, edit, and delete products
- **Stock Control**: Manage inventory and availability
- **Drag & Drop Reordering**: Control product display order
- **Real-time Updates**: Changes reflect immediately on customer side
- **Image Upload**: Add product images (placeholder support)

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Drag & Drop**: React Beautiful DnD

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd janu-enterprise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/janu_enterprise"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ADMIN_EMAIL="admin@januenterprise.com"
   ADMIN_PASSWORD="your-admin-password"
   WHATSAPP_NUMBER="+1234567890"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Create admin user**
   ```bash
   npx prisma studio
   ```
   - Open Prisma Studio
   - Go to User table
   - Create a new user with:
     - email: admin@januenterprise.com
     - isAdmin: true
     - password: (hashed password)

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy

3. **Set up Vercel Postgres**
   - In Vercel dashboard, go to Storage
   - Create a new Postgres database
   - Copy the connection string to `DATABASE_URL`

4. **Update environment variables**
   - `NEXTAUTH_URL`: Your Vercel domain
   - `DATABASE_URL`: Vercel Postgres connection string
   - `NEXTAUTH_SECRET`: Generate a random string

## Usage

### Customer Flow
1. Visit the website
2. Browse products or search for specific items
3. Add items to cart
4. Click the cart button
5. Fill in customer details (optional)
6. Click "Order via WhatsApp"
7. WhatsApp opens with formatted order message
8. Send message to complete order

### Admin Flow
1. Go to `/admin/login`
2. Sign in with admin credentials
3. Manage products:
   - Add new products
   - Edit existing products
   - Delete products
   - Reorder products by dragging
4. Monitor stock levels
5. Control product availability

## Project Structure

```
janu-enterprise/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   └── products/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── CartButton.tsx
│   ├── Header.tsx
│   └── ProductCard.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── store.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
└── public/
    └── placeholder-food.jpg
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Your app URL | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes |
| `ADMIN_EMAIL` | Admin email address | Yes |
| `ADMIN_PASSWORD` | Admin password (hashed) | Yes |
| `WHATSAPP_NUMBER` | WhatsApp business number | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@januenterprise.com or create an issue in the repository.

## Roadmap

- [ ] Email notifications
- [ ] Order tracking
- [ ] Customer accounts
- [ ] Payment integration
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app
