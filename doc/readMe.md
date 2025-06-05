# React Application Documentation

## Overview

This is a production-ready React application built with modern tools and best practices. It includes authentication, internationalization, state management, and a comprehensive UI component system.

## Tech Stack

- **Frontend Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit (RTK) + RTK Query
- **Routing**: React Router v6
- **API Communication**: Axios
- **Form Handling**: React Hook Form + Yup
- **UI Components**: ShadCN
- **Internationalization**: react-i18next
- **Bundler**: Vite

## Project Structure

```
src/
├── app/                    # Redux store and root configuration
├── assets/                 # Static assets (images, fonts, translations)
├── common/                 # Shared constants, types, and interfaces
├── components/            
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components (Navbar, Sidebar)
│   └── shared/            # Reusable components
├── features/              
│   ├── auth/              # Authentication feature
│   ├── dashboard/         # Dashboard feature
│   ├── profile/           # User profile feature
│   ├── settings/          # Settings feature
│   └── admin/             # Admin feature
├── hooks/                 # Custom React hooks
├── layouts/               # Page layouts
├── lib/                   # Third-party library initialization
├── routes/                # Route definitions and guards
├── services/              # API and authentication services
└── store/                 # Redux store configuration

```

## Key Features

1. **Authentication**
   - JWT-based authentication with access/refresh tokens
   - Protected routes and role-based access control
   - Automatic token refresh
   - Login/Register forms with validation

2. **Internationalization**
   - Support for multiple languages (English, Spanish)
   - Easy language switching
   - Translations for all UI text

3. **Theme Support**
   - Light/Dark mode
   - System theme detection
   - Persistent theme preference

4. **State Management**
   - Centralized Redux store
   - RTK Query for API calls
   - Automatic cache invalidation

## Getting Started

1. **Installation**
   ```bash
   npm install
   ```

2. **Development**
   ```bash
   npm run dev
   ```

3. **Build**
   ```bash
   npm run build
   ```

## Authentication Flow

1. User logs in/registers
2. JWT tokens (access + refresh) are stored
3. Access token is attached to API requests
4. Automatic token refresh on expiration
5. Role-based route protection

## Adding New Features

1. Create a new directory in `src/features/`
2. Add necessary components, hooks, and types
3. Update routes in `src/routes/index.tsx`
4. Add translations in `src/assets/locales/`

## Best Practices

1. **Code Organization**
   - Feature-based folder structure
   - Shared components in `components/`
   - Feature-specific components within feature folders

2. **State Management**
   - Use Redux for global state
   - Local state for component-specific data
   - RTK Query for API calls

3. **Type Safety**
   - TypeScript for all files
   - Proper interface definitions
   - Strict type checking

4. **Error Handling**
   - Global error boundary
   - API error interceptors
   - User-friendly error messages

## Common Tasks

1. **Adding a New Route**
   ```typescript
   // src/routes/index.tsx
   {
     path: '/new-feature',
     element: (
       <Suspense fallback={<LoadingFallback />}>
         <NewFeaturePage />
       </Suspense>
     ),
   }
   ```

2. **Adding New Translations**
   ```typescript
   // src/assets/locales/en.json
   {
     "newFeature": {
       "title": "New Feature",
       "description": "Description"
     }
   }
   ```

3. **Creating Protected Routes**
   ```typescript
   // Wrap in PrivateRoute for authentication
   // Use RoleGuard for role-based access
   {
     element: <RoleGuard allowedRoles={[UserRole.ADMIN]} />,
     children: [
       {
         path: '/admin',
         element: <AdminPage />
       }
     ]
   }
   ```

## API Integration

1. **Making API Calls**
   ```typescript
   // Using RTK Query
   export const api = createApi({
     baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
     endpoints: (builder) => ({
       getData: builder.query({
         query: () => 'data'
       })
     })
   });
   ```

2. **Error Handling**
   ```typescript
   try {
     await apiCall();
   } catch (error) {
     toast({
       title: t('errors.somethingWentWrong'),
       variant: 'destructive'
     });
   }
   ```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. The build output will be in the `dist` directory

3. Deploy the contents of `dist` to your hosting provider

## Contributing

1. Follow the established code structure
2. Use TypeScript for all new code
3. Add appropriate tests
4. Update documentation as needed
5. Follow the commit message convention