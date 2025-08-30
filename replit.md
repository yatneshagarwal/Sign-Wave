# Overview

SignWave is an AI-powered Indian Sign Language (ISL) translation application that provides real-time gesture recognition and converts ISL to text and speech. The application features a modern web interface with a React frontend and Express backend, designed to break communication barriers for the deaf and hard-of-hearing community. Key features include regional ISL dialect support, emergency detection, real-time translation with confidence scoring, and an accessible dark theme interface with neon accent colors.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks for local state, TanStack Query for server state management
- **UI Framework**: Radix UI primitives with shadcn/ui components for accessible design system
- **Styling**: Tailwind CSS with custom dark theme and neon accent colors (teal/magenta gradients)
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints for gesture data management
- **Storage**: In-memory storage implementation with interface for future database integration
- **Validation**: Zod schemas for request/response validation

## Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe database operations
- **Schema**: Users and gestures tables with support for regional variants and confidence scoring
- **Migration**: Drizzle Kit for database schema management
- **Current Implementation**: In-memory storage (MemStorage) for development, with interface ready for database integration

## Authentication and Authorization
- **Current State**: Basic user schema defined but authentication not yet implemented
- **Prepared Infrastructure**: User table with username/password fields ready for auth implementation

## Core Features Architecture
- **Gesture Recognition**: Custom hooks for camera access and simulated gesture processing
- **Real-time Translation**: Mock implementation with confidence scoring and regional dialect support
- **Speech Synthesis**: Web Speech API integration with volume control and multi-language support
- **Accessibility**: High contrast mode, custom cursor states, keyboard navigation support
- **Toast Notifications**: Custom notification system with multiple severity levels

## Design System
- **Theme**: Neo-noir hacker aesthetic with dark backgrounds and neon gradients
- **Typography**: Inter font family with JetBrains Mono for code elements
- **Colors**: CSS custom properties for consistent theming with primary (teal) and accent (magenta) colors
- **Components**: Comprehensive UI component library built on Radix primitives
- **Animations**: Smooth transitions and micro-interactions for enhanced user experience

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form with Zod resolvers
- **Backend**: Express.js with TypeScript support via tsx
- **Database**: PostgreSQL via Neon serverless with Drizzle ORM
- **Validation**: Zod for runtime type checking and schema validation

## UI and Styling
- **Component Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Icons**: Lucide React for consistent iconography
- **Utilities**: clsx and tailwind-merge for conditional styling

## Development Tools
- **Build Tools**: Vite with React plugin and runtime error overlay
- **Database Tools**: Drizzle Kit for migrations and schema management
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Development**: Replit-specific plugins for enhanced development experience

## Third-party Services
- **Database**: Neon serverless PostgreSQL for production database hosting
- **Media**: Web APIs for camera access and speech synthesis (no external services required)
- **Fonts**: Google Fonts for typography (Inter, JetBrains Mono)

The application is designed to be government-deployment ready with features like audit logging, accessibility compliance, and offline capability preparation, though these advanced features are currently in planning/mock implementation phase.