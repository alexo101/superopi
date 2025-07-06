# Superopi - Product Rating Platform

## Overview

Superopi is a full-stack web application for rating and reviewing supermarket products. Users can browse products by category, search for specific items, and upload new products with ratings and images. The application features a modern, mobile-first design with a comprehensive product database covering Spanish supermarket chains.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom theme configuration
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: Replit Auth with OpenID Connect
- **Build Tool**: Vite with custom plugin configuration

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: Replit Auth with Passport.js strategy
- **File Upload**: Multer middleware for image handling
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot module replacement with Vite integration

### Database Schema
- **Products Table**: Core entity storing product information
  - Basic info: name, brand, rating, category, supermarket
  - Taste attributes: sweetness, saltiness (1-10 scale)
  - Image URL for product photos
- **Categories**: Predefined categories (Food, Drinks, Personal Care, Home Cleaning, Pets)
- **Supermarkets**: Comprehensive list of Spanish supermarket chains

## Key Components

### Data Layer
- **Drizzle ORM Configuration**: PostgreSQL dialect with schema-first approach
- **Database Connection**: Neon serverless with WebSocket support
- **Schema Validation**: Zod schemas for type-safe data validation
- **Storage Interface**: Abstracted storage layer for database operations

### API Layer
- **RESTful Endpoints**: Express routes for CRUD operations
- **File Upload**: Image upload with validation and storage
- **Error Handling**: Centralized error middleware
- **Request Logging**: Custom middleware for API request tracking

### Frontend Components
- **Product Grid**: Responsive grid layout for product display
- **Category Navigation**: Icon-based category selection
- **Search Functionality**: Real-time product search
- **Upload Form**: Multi-step form with image upload and validation
- **Mobile Navigation**: Bottom navigation bar for mobile experience

### UI System
- **Design System**: shadcn/ui components with Radix UI primitives
- **Theme**: Professional variant with customizable colors and radius
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA-compliant components from Radix UI

## Data Flow

1. **Product Browsing**: Users navigate categories or search products
2. **Data Fetching**: TanStack Query manages server state and caching
3. **API Requests**: Frontend communicates with Express backend
4. **Database Queries**: Drizzle ORM executes type-safe SQL queries
5. **Response Handling**: Data flows back through the same pipeline
6. **UI Updates**: React components re-render with new data

### Upload Flow
1. User selects image and fills product form
2. Image uploads to server storage via Multer
3. Form data validates against Zod schema
4. Product record creates in PostgreSQL database
5. Success confirmation displays to user

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL provider
- **Connection**: WebSocket-based connection pooling
- **Migrations**: Drizzle Kit for schema management

### File Storage
- **Local Storage**: Multer disk storage for uploaded images
- **Static Serving**: Express static middleware for image access
- **Validation**: File type and size restrictions

### UI Libraries
- **Radix UI**: Headless component primitives
- **Lucide React**: Icon library
- **Date-fns**: Date utility functions
- **Class Variance Authority**: Component variant management

## Deployment Strategy

### Development
- **Dev Server**: Vite development server with HMR
- **API Integration**: Express server with Vite middleware
- **Database**: Direct connection to Neon database
- **File Uploads**: Local disk storage

### Production
- **Build Process**: 
  - Frontend: Vite builds optimized React bundle
  - Backend: ESBuild bundles Node.js server
- **Static Assets**: Built frontend serves from Express
- **Database**: Production Neon database connection
- **Environment**: NODE_ENV=production configuration

### Configuration
- **Environment Variables**: DATABASE_URL for database connection
- **TypeScript**: Strict type checking enabled
- **Module System**: ES modules throughout the stack
- **Path Aliases**: Configured for clean imports

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 01, 2025. Initial setup
- July 06, 2025. Implemented Replit Auth integration with OpenID Connect
  - Added user authentication and session management
  - Created landing page for unauthenticated users
  - Added logout functionality to home page
  - Implemented authorization error handling throughout app
  - Updated routing to show different pages based on auth status