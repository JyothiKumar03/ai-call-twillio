# ProdGain Backend Template

This is a backend template for ProdGain projects. It includes setup for Express, TypeScript, ESLint, Prettier, Husky, and Commitlint.

## Prerequisites

- Node.js (version 18 or later recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ProdGainAI/server-template.git
   cd prodgain-be-template
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Project Structure

The `src/` directory contains the following folders:

- `models/`: Database models and schemas
- `constants/`: Constant values and configurations
- `controllers/`: Request handlers for routes
- `middlewares/`: Custom middleware functions
- `routes/`: API route definitions
- `services/`: Business logic and data processing
- `tests/`: Unit and integration tests
- `types/`: TypeScript type definitions
- `utils/`: Utility functions and helpers
- `validators/`: Input validation schemas and functions

## Available Scripts

- `npm run build`: Builds the project
- `npm start`: Starts the production server
- `npm run dev`: Starts the development server
- `npm run lint`: Runs ESLint
- `npm run lint:fix`: Runs ESLint and fixes issues
- `npm run format`: Checks formatting with Prettier
- `npm run format:fix`: Fixes formatting issues with Prettier
- `npm run docker:dev:up`: Starts the development environment in Docker
- `npm run docker:prod:up`: Starts the production environment in Docker

## Commit Message Guidelines

This project uses commitlint to enforce consistent commit messages. The format is:

```sh
type: commit message
```

Where `type` is one of:

- feat: a new feature
- fix: a bug fix
- docs: documentation only changes
- style: changes that do not affect the meaning of the code
- refactor: a code change that neither fixes a bug nor adds a feature
- perf: a code change that improves performance
- test: adding missing tests or correcting existing tests
- chore: changes to the build process or auxiliary tools and libraries
- revert: revert to a commit
- build: changes that affect the build system or external dependencies
- ci: changes to ci configuration files and scripts

Example:

```sh
feat: add user authentication
```

## Docker

This project includes Docker configuration for both development and production environments. Use the provided npm scripts to start the Docker environments.
