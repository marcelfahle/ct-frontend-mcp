# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Tastic Generator - A tool for generating commercetools frontend component schemas ("tastics").

## Commands
- Build/Run: `bun run index.ts`
- TypeCheck: `bun tsc --noEmit`
- Lint: `bun tsc --noEmit` (no dedicated linter configured)
- Docker: `docker-compose up` to start the service

## Code Style Guidelines
- **Imports**: ES modules with `.js` extension in import paths
- **Types**: Use TypeScript strict mode with proper type annotations
- **Formatting**: 2-space indentation
- **Naming**: 
  - camelCase for variables, functions, and properties
  - PascalCase for classes and types
  - Use descriptive names
- **Error Handling**: Use try/catch for async operations
- **Validation**: Use Zod for schema validation and type safety
- **Architecture**: Modular approach with register* functions for server setup

## Key Patterns
- Use Zod for schema validation
- Server resources, tools, and prompts are registered separately
- Express for HTTP endpoints
- MCP SDK for server/client communication