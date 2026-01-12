# MEDSTARGENX

A modern medical research and patient management system built with React, TypeScript, and Vite.

## 🚀 Features

- **Patient Management** - Comprehensive patient profile and records management
- **Research Portal** - Medical research data and analytics
- **Dashboard** - Real-time insights and data visualization
- **Authentication** - Secure user authentication and authorization
- **Settings** - Customizable user preferences and configurations
- **Responsive Design** - Built with Tailwind CSS and shadcn-ui components

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.3
- **Language**: TypeScript 5.8
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4
- **UI Components**: shadcn-ui (Radix UI)
- **Routing**: React Router DOM 6.30
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React

## 📁 Project Structure

```
MEDSTARGENX/
├── src/
│   ├── features/          # Feature-based modules
│   │   ├── auth/          # Authentication features
│   │   ├── dashboard/     # Dashboard components
│   │   ├── patients/      # Patient management
│   │   ├── research/      # Research portal
│   │   ├── settings/      # Settings and preferences
│   │   └── landing/       # Landing page components
│   ├── components/        # Shared components
│   │   ├── ui/            # shadcn-ui components
│   │   └── layout/        # Layout components
│   ├── pages/             # Page components
│   ├── services/          # API and external services
│   │   └── api/           # API client configuration
│   ├── utils/             # Utility functions
│   ├── constants/         # App constants and config
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── assets/            # Static assets
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   └── lib/               # Library configurations
├── docs/                  # Documentation
├── public/                # Public static files
└── ...config files

```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Udham-makeithappen/MEDSTARGENX.git
   cd MEDSTARGENX
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration values.

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Development Workflow

### Adding New Features

1. Create a new folder in `src/features/` for your feature
2. Add components, hooks, and services specific to that feature
3. Export public APIs through an `index.ts` file
4. Import and use in your pages

### Code Organization

- **Components**: Reusable UI components go in `src/components/`
- **Pages**: Route-level components go in `src/pages/`
- **Features**: Feature-specific code goes in `src/features/`
- **Utils**: Helper functions go in `src/utils/`
- **Constants**: Configuration and constants go in `src/constants/`

### Styling Guidelines

- Use Tailwind CSS utility classes for styling
- Use shadcn-ui components for consistent UI
- Follow the design system defined in `tailwind.config.ts`

## 🔒 Environment Variables

See `.env.example` for all available environment variables:

- `VITE_API_URL` - Backend API URL
- `VITE_AUTH_TOKEN_KEY` - Authentication token storage key
- `VITE_ENABLE_RESEARCH` - Enable/disable research features
- `VITE_ENABLE_ANALYTICS` - Enable/disable analytics

## 📚 Documentation

For more detailed documentation, see the `/docs` folder:

- [Setup Guide](docs/SETUP.md) - Detailed setup instructions
- [Architecture](docs/ARCHITECTURE.md) - System architecture overview
- [Project Structure](STRUCTURE.md) - Detailed folder structure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Team

Developed by the MEDSTARGENX team.

## 🔗 Links

- **Project URL**: [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)
- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues

---

Built with ❤️ using React + TypeScript + Vite
