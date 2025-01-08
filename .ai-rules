# rolod0x repository goals, rules, and conventions

Briefly mention when any of the below information or guidelines have
an impact on the changes you make, so that it's clear they're being
taken into account.

If you see a reason for changes which fall under the following
categories:

- removal of existing comments

- additional changes that weren't asked for (e.g. minor cleanups
  or refactorings)

- significant strategy changes to the code or tests
  (such as introducing or removing mocking of a component)

then DO NOT directly apply them to the files, but instead first
suggest them to check that's OK.

## Project overview

rolod0x is an Open Source private onchain address book, built as a
browser extension aiming for compatibility with as many browsers as
possible.

## Tech Stack

- **Frontend Framework**: React 18.x with TypeScript
- **UI Components**: Material-UI (MUI) v5 (but with an intention to upgrade to v6 soon)
- **Styling**: Emotion CSS-in-JS
- **State Management**: React Router for navigation
- **Code Editor**: CodeMirror 6
- **WebExtension APIs**: via `webextension-polyfill`
- **Build Tools**:
  - Vite for bundling
  - PNPM for package management
  - TypeScript for type safety
- **Testing**:
  - Vitest for unit testing
  - React Testing Library for component testing

## Code Style & Conventions

### TypeScript Configuration

- Strict TypeScript configuration with modern ESNext features
- Path aliases configured for clean imports (e.g., `@src/`, `@pages/`)
- React JSX with TypeScript (`.tsx` extension)

### Code Organization

- Source code in `src/` directory
- Pages in `src/pages/`
- Assets in `src/assets/`
- Shared utilities in `src/shared/`

### Development Workflow

- Use pnpm for package management
- Use `pnpm vitest run $FILE_TO_TEST` to run tests
- Run `pnpm build` to ensure that the code compiles correctly

### Code Quality

- ESLint for code linting
- Prettier for code formatting
- Commitlint for conventional commit messages, with appropriate commit types:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `style:` for formatting
  - `refactor:` for code refactoring
  - `test:` for adding tests
  - `chore:` for maintenance

## Contribution Guidelines

- Update documentation as needed
- Follow the established code style
- Follow all best practices below

## Best practices

### General best practices

- Avoid code duplication as much as possible
- Follow TypeScript best practices
- Use proper type annotations
- Document complex logic
- Follow the principle of least privilege for extension permissions

### Testing best practices

- Write tests for new features and ensure they pass
- Use React Testing Library for component tests
- Test behavior, not implementation
- Use meaningful test descriptions
- Keep tests isolated
- Don't add imports from vi for the following vitest globals as they're
  imported by default: beforeEach, describe, expect, it, vi

### React best practices

- Use functional components with hooks
- Implement proper React error boundaries
- Keep React components small and focused
