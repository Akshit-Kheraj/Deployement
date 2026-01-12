# Setup Guide

Complete setup instructions for MEDSTARGENX.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm** (comes with Node.js) or **yarn** or **bun**
  - Verify npm: `npm --version`
  - Or install yarn: `npm install -g yarn`
  - Or install bun: `npm install -g bun`

- **Git**
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Udham-makeithappen/MEDSTARGENX.git
cd MEDSTARGENX
```

### 2. Install Dependencies

Choose your preferred package manager:

**Using npm:**
```bash
npm install
```

**Using yarn:**
```bash
yarn install
```

**Using bun:**
```bash
bun install
```

This will install all dependencies listed in `package.json`.

### 3. Environment Configuration

Create a local environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Authentication
VITE_AUTH_TOKEN_KEY=medstargenx_auth_token
VITE_SESSION_TIMEOUT=3600000

# Features
VITE_ENABLE_RESEARCH=true
VITE_ENABLE_ANALYTICS=true

# Development
VITE_DEV_MODE=true
VITE_LOG_LEVEL=debug
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at:
- **Local**: `http://localhost:5173`
- **Network**: `http://[your-ip]:5173`

## Development Workflow

### Running the Application

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production build**:
```bash
npm run build
```

**Preview production build**:
```bash
npm run preview
```

### Code Quality

**Lint your code**:
```bash
npm run lint
```

**Fix linting issues**:
```bash
npm run lint -- --fix
```

## Project Structure Overview

```
MEDSTARGENX/
├── src/                   # Source code
│   ├── features/          # Feature modules
│   ├── components/        # Shared components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── utils/             # Utilities
│   ├── constants/         # Constants
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── types/             # TypeScript types
│   └── assets/            # Static assets
├── public/                # Public files
├── docs/                  # Documentation
└── ...config files
```

See [STRUCTURE.md](../STRUCTURE.md) for detailed structure documentation.

## Common Issues and Solutions

### Port Already in Use

If port 5173 is already in use:

1. Kill the process using the port
2. Or change the port in `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 3000, // Change to your preferred port
  },
});
```

### Module Not Found Errors

If you encounter module not found errors:

1. Delete `node_modules` and lock files:
   ```bash
   rm -rf node_modules package-lock.json
   ```

2. Reinstall dependencies:
   ```bash
   npm install
   ```

### TypeScript Errors

If you see TypeScript errors:

1. Restart your IDE/editor
2. Clear TypeScript cache:
   ```bash
   rm -rf node_modules/.vite
   ```

## IDE Setup

### VS Code (Recommended)

Install recommended extensions:

1. **ESLint** - Code linting
2. **Prettier** - Code formatting
3. **Tailwind CSS IntelliSense** - Tailwind autocomplete
4. **TypeScript Vue Plugin (Volar)** - Better TypeScript support

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Next Steps

1. ✅ Complete setup
2. 📖 Read [STRUCTURE.md](../STRUCTURE.md) to understand the project structure
3. 📖 Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system architecture
4. 🚀 Start developing!

## Getting Help

- Check the [README.md](../README.md) for general information
- Review [STRUCTURE.md](../STRUCTURE.md) for code organization
- Open an issue on GitHub for bugs or questions

---

Happy coding! 🎉
