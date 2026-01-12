# MEDSTARGENX Project Structure

This document provides a comprehensive overview of the project's folder structure and organization principles.

## 📁 Directory Structure

### `/src` - Source Code

The main application source code directory.

#### `/src/features` - Feature Modules

Feature-based organization following domain-driven design principles. Each feature is self-contained with its own components, hooks, and logic.

- **`/auth`** - Authentication and authorization
  - Login/Register components
  - Auth hooks and context
  - Auth-related utilities

- **`/dashboard`** - Dashboard features
  - Dashboard widgets and charts
  - Data visualization components
  - Dashboard-specific hooks

- **`/patients`** - Patient management
  - Patient profile components
  - Patient records management
  - Patient-related services

- **`/research`** - Research portal
  - Research data components
  - Research analytics
  - Research-specific features

- **`/settings`** - Settings and preferences
  - User settings components
  - Configuration management
  - Preference controls

- **`/landing`** - Landing page
  - Hero section
  - Feature showcase
  - Marketing components

#### `/src/components` - Shared Components

Reusable components used across multiple features.

- **`/ui`** - UI Component Library (shadcn-ui)
  - 49 pre-built components from Radix UI
  - Buttons, inputs, dialogs, etc.
  - Fully customizable and accessible

- **`/layout`** - Layout Components
  - AppLayout - Main application layout
  - AppSidebar - Navigation sidebar
  - Header, Footer, etc.

#### `/src/pages` - Page Components

Route-level components that compose features and components.

- `Index.tsx` - Landing page
- `Dashboard.tsx` - Main dashboard
- `PatientProfile.tsx` - Patient profile page
- `PatientRecords.tsx` - Patient records page
- `Settings.tsx` - Settings page
- `Auth.tsx` - Authentication page
- `Research.tsx` - Research portal page
- `Pricing.tsx` - Pricing page
- `NotFound.tsx` - 404 page

#### `/src/services` - Services Layer

External integrations and API communication.

- **`/api`** - API Client
  - HTTP client configuration
  - Request/response interceptors
  - API error handling

- Service files for different domains:
  - `auth.service.ts` - Authentication API
  - `patient.service.ts` - Patient data API
  - `research.service.ts` - Research data API

#### `/src/utils` - Utility Functions

Pure helper functions and utilities.

- **`formatters.ts`** - Data formatting
  - Date/time formatting
  - Number formatting
  - File size formatting
  - Text truncation

- **`validators.ts`** - Validation functions
  - Email validation
  - Phone validation
  - Password strength
  - Form validators

- **`helpers.ts`** - General helpers
  - Delay/debounce functions
  - ID generation
  - Object manipulation
  - String utilities

#### `/src/constants` - Constants and Configuration

Application-wide constants and configuration.

- **`routes.ts`** - Route definitions
  - All application routes
  - Route helper functions

- **`config.ts`** - App configuration
  - Environment-based config
  - Feature flags
  - API configuration

#### `/src/contexts` - React Contexts

Global state management using React Context API.

- `AuthContext.tsx` - Authentication state
- `ThemeContext.tsx` - Theme preferences
- Other global contexts as needed

#### `/src/hooks` - Custom React Hooks

Reusable React hooks for common functionality.

- Custom hooks for data fetching
- Form handling hooks
- UI state hooks

#### `/src/types` - TypeScript Types

Global TypeScript type definitions and interfaces.

- Shared types and interfaces
- API response types
- Domain models

#### `/src/assets` - Static Assets

Static files like images, fonts, and icons.

- **`/images`** - Image files
- **`/fonts`** - Custom fonts
- **`/icons`** - Icon files

#### `/src/lib` - Library Configurations

Third-party library configurations and utilities.

- `utils.ts` - Utility functions for libraries
- Library-specific helpers

---

## 🎯 Organization Principles

### 1. Feature-Based Structure

Features are organized by domain/business logic rather than technical role. Each feature folder contains everything related to that feature.

### 2. Barrel Exports

Each major folder has an `index.ts` file that exports public APIs, enabling clean imports:

```typescript
// Instead of:
import { formatDate } from '@/utils/formatters';
import { isValidEmail } from '@/utils/validators';

// You can do:
import { formatDate, isValidEmail } from '@/utils';
```

### 3. Separation of Concerns

- **Components** - UI and presentation
- **Services** - Data fetching and external APIs
- **Utils** - Pure functions without side effects
- **Hooks** - Stateful logic and side effects
- **Constants** - Configuration and static data

### 4. Scalability

The structure supports growth:
- Add new features without affecting existing code
- Easy to locate and modify specific functionality
- Clear boundaries between different parts of the application

### 5. Type Safety

TypeScript is used throughout for type safety:
- Shared types in `/types`
- Feature-specific types in feature folders
- Proper typing for all functions and components

---

## 📝 Naming Conventions

### Files
- **Components**: PascalCase (e.g., `PatientProfile.tsx`)
- **Utilities**: camelCase (e.g., `formatters.ts`)
- **Constants**: camelCase (e.g., `routes.ts`)
- **Types**: camelCase (e.g., `patient.types.ts`)

### Folders
- **Features**: lowercase (e.g., `auth`, `dashboard`)
- **Components**: lowercase (e.g., `ui`, `layout`)

### Exports
- **Named exports** for utilities and services
- **Default exports** for components and pages

---

## 🔄 Import Aliases

The project uses path aliases for clean imports:

```typescript
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import { formatDate } from '@/utils';
```

Configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 🚀 Adding New Features

When adding a new feature:

1. Create a folder in `/src/features/[feature-name]`
2. Add components, hooks, and services specific to that feature
3. Create an `index.ts` to export public APIs
4. Add types in a `types.ts` file within the feature
5. Import and use in your pages

Example structure for a new feature:
```
/src/features/appointments/
├── components/
│   ├── AppointmentCard.tsx
│   └── AppointmentList.tsx
├── hooks/
│   └── useAppointments.ts
├── services/
│   └── appointments.service.ts
├── types.ts
└── index.ts
```

---

This structure promotes maintainability, scalability, and developer productivity while following React and TypeScript best practices.
