# CLAUDE.md

## Documentation First

**IMPORTANT:** Before generating any code, Claude Code should ALWAYS first refer to the relevant documentation files within the `/docs` directory. These docs contain project-specific guidelines, conventions, and patterns that must be followed.

### Available Documentation

- `/docs/ui.md` - UI components and styling guidelines
- `/docs/data-fetching.md` - data fetching guidelines
- `/docs/data-mutations.md` - data mutations guidelines (server actions, validation)
- `/docs/auth.md` - authentication guidelines (Clerk)
- `/docs/server-components.md` - server component coding standards (Next.js 15 async params)
- `/docs/routing.md` - routing standards (protected routes, middleware) 

### Workflow

1. Check `/docs` for relevant documentation before writing code
2. Follow the patterns and conventions defined in the docs
3. If no relevant docs exist, ask clarifying questions or proceed with best practices
