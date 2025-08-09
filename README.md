# 🚀 FormHire - Modern Job Portal Platform

<div align="center">



**A cutting-edge job portal built with Next.js 14, TypeScript, and modern web technologies**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.30-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](https://form-hire.vercel.app) 

</div>

---

## ✨ Features

### 🎯 **For Job Seekers**
- 🔐 **Secure Authentication** - Google OAuth & custom credentials
- 📄 **Smart Resume Upload** - Cloudinary-powered file management
- 🔍 **Advanced Job Search** - Filter by location, skills, experience
- 📊 **Application Tracking** - Real-time status updates
- 👤 **Professional Profiles** - Showcase your skills and experience
- 📱 **Mobile Responsive** - Seamless experience across devices

### 🏢 **For Employers & Admins**
- ⚡ **Admin Dashboard** - Comprehensive job and application management
- 📝 **Job Posting** - Rich editor with custom questions
- 👥 **Applicant Management** - Review, filter, and track candidates
- 📈 **Analytics Dashboard** - Insights on job performance
- 🎨 **Custom Branding** - Company logos and branding options
- 🔒 **Role-based Access** - Secure admin and employer permissions

### 🛠 **Technical Excellence**
- ⚡ **Lightning Fast** - Server-side rendering with Next.js 14
- 🎨 **Modern UI/UX** - Tailwind CSS with responsive design
- 🗄️ **Robust Database** - PostgreSQL with Prisma ORM
- 🔒 **Enterprise Security** - NextAuth.js authentication
- 📊 **Type Safety** - Full TypeScript implementation
- 🚀 **Production Ready** - Optimized build and deployment

---

## 🛠 Tech Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Prisma ORM, PostgreSQL |
| **Authentication** | NextAuth.js, Google OAuth, JWT |
| **File Storage** | Cloudinary |
| **UI Components** | Lucide React Icons, Custom Components |
| **Deployment** | Vercel, Neon Database |

</div>

---

## 🚀 Quick Start

### Prerequisites

```bash
node >= 18.0.0
npm >= 9.0.0
# or
pnpm >= 8.0.0
```

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/formhire.git
cd formhire
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using pnpm (recommended)
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/formhire"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-jwt-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary (File Upload)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
formhire/
├── 📁 src/
│   ├── 📁 app/                    # Next.js 14 App Router
│   │   ├── 📁 admin/              # Admin dashboard pages
│   │   ├── 📁 api/                # API routes
│   │   ├── 📁 auth/               # Authentication pages
│   │   ├── 📁 jobs/               # Job listing pages
│   │   └── 📄 page.tsx            # Homepage
│   ├── 📁 components/             # Reusable UI components
│   │   ├── 📁 admin/              # Admin-specific components
│   │   ├── 📁 home/               # Homepage components
│   │   ├── 📁 jobs/               # Job-related components
│   │   └── 📁 layout/             # Layout components
│   ├── 📁 lib/                    # Utility libraries
│   │   ├── 📄 auth.ts             # NextAuth configuration
│   │   ├── 📄 prisma.ts           # Prisma client
│   │   └── 📄 utils.ts            # Helper functions
│   └── 📁 types/                  # TypeScript type definitions
├── 📁 prisma/                     # Database schema & migrations
├── 📁 public/                     # Static assets
├── 📄 tailwind.config.js          # Tailwind CSS configuration
├── 📄 next.config.js              # Next.js configuration
└── 📄 package.json                # Dependencies & scripts
```

---

## 🎨 Screenshots

<div align="center">

### 🏠 Homepage
![Homepage](https://cdn.discordapp.com/attachments/1245391146226679868/1398003059887570944/image.png?ex=6883c74f&is=688275cf&hm=aeebddfa5eec53fd8c06543096faf1e54493b4bcc045d5e5d62ee35e66222745&)

### 💼 Job Listings
![Job Listings](https://cdn.discordapp.com/attachments/1245391146226679868/1398003419842871306/image.png?ex=6883c7a4&is=68827624&hm=47b7987808cd599fa268fdfa5efc516b34741d51e07e19ea02de991134c0de31&)

### 📊 Admin Dashboard
![Admin Dashboard](https://cdn.discordapp.com/attachments/1245391146226679868/1398003621005754390/image.png?ex=6883c7d4&is=68827654&hm=b81cbcf1867cf6f73ba1ef1ba5c9d2813318444437e781e377b59597755d09da&)

### 📱 Mobile Experience
![Mobile](https://cdn.discordapp.com/attachments/1245391146226679868/1398004581887381614/image.png?ex=6883c8b9&is=68827739&hm=8ab2e2e959e4a03dab3e8c937ba0d21d9b559e370de6c4f62e98c55ec4ad419d&)

</div>

---

## 🔧 Configuration


Current admin emails are configured in:
```typescript
// src/lib/admin.ts
export const getAdminEmails = () => {
  return [
    'your email',
  ]
}
```

### Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User** - User profiles and authentication
- **Job** - Job postings with detailed information
- **Application** - Job applications with status tracking
- **Account/Session** - NextAuth.js session management

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy with one click

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Database Deployment

The project uses Neon PostgreSQL for production:

1. Create a Neon account
2. Create a new database
3. Update `DATABASE_URL` in your environment
4. Run migrations: `npx prisma db push`

---

## 🌟 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Prisma](https://www.prisma.io/) for the excellent database toolkit
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Lucide React](https://lucide.dev/) for beautiful icons
- [Cloudinary](https://cloudinary.com/) for file management

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ and ☕ by Suyash

</div>
