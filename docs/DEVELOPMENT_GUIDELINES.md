# Development Guidelines

## TypeScript Error Prevention Guide

This document provides guidelines to prevent TypeScript errors and maintain code quality standards.

## Common TypeScript Issues & Prevention

### 1. Function Return Type Consistency

**Issue**: `error TS7030: Not all code paths return a value`

```typescript
// ❌ BAD: Not all paths return a value
function useEffect(() => {
  if (condition) {
    return () => cleanup()
  }
  // Missing return for else case
}, [])

// ✅ GOOD: All paths return a value
function useEffect(() => {
  if (condition) {
    return () => cleanup()
  }
  return undefined // or return nothing explicitly
}, [])
```

### 2. Unused Variables & Parameters

**Issue**: Variables defined but never used

```typescript
// ❌ BAD: Unused variables
function handleRequest(request: Request, response: Response) {
  // Only using response, request is unused
  return response.json({})
}

// ✅ GOOD: Prefix unused parameters with underscore
function handleRequest(_request: Request, response: Response) {
  return response.json({})
}
```

### 3. Implicit Type Coercion

**Issue**: Using `!!` or other implicit coercion

```typescript
// ❌ BAD: Implicit coercion
if (!!value) { ... }
if (+value) { ... }

// ✅ GOOD: Explicit conversion
if (Boolean(value)) { ... }
if (Number(value)) { ... }
```

## Pre-Commit Workflow

Our pre-commit hooks will catch these issues automatically:

1. **TypeScript Check**: `npm run type-check`
2. **ESLint with Auto-fix**: `eslint --fix --max-warnings 0`
3. **Prettier Formatting**: `prettier --write`

## Local Development Commands

```bash
# Run all checks before committing
npm run type-check && npm run lint && npm run format

# Fix common issues automatically
npm run lint -- --fix

# Check specific files
npx eslint src/components/MyComponent.tsx --fix
```

## Code Quality Standards

### TypeScript Configuration

Our `tsconfig.json` includes strict checking:

- `strict: true`
- `noImplicitReturns: true`
- `strictNullChecks: true`
- `noUncheckedIndexedAccess: true`

### ESLint Rules

Key rules that prevent runtime errors:

- `consistent-return`: Ensure consistent return patterns
- `@typescript-eslint/no-unused-vars`: Catch unused variables
- `no-implicit-coercion`: Prevent implicit type conversions
- `react-hooks/exhaustive-deps`: Ensure proper hook dependencies

## Best Practices

### 1. Component Development

```typescript
// ✅ GOOD: Well-structured component
export default function MyComponent(): JSX.Element {
  const [state, setState] = useState<string>('')

  useEffect(() => {
    // All side effects properly typed
    const cleanup = setupEffect()
    return cleanup
  }, [])

  return <div>{state}</div>
}
```

### 2. Error Handling

```typescript
// ✅ GOOD: Proper error handling
try {
  await riskyOperation()
} catch (error) {
  console.error('Operation failed:', error)
  // Handle error appropriately
}
```

### 3. Type Safety

```typescript
// ✅ GOOD: Use proper types instead of any
interface UserData {
  id: string
  name: string
  email: string
}

// Avoid: any
function processUser(user: any) { ... }

// Prefer: Proper types
function processUser(user: UserData) { ... }
```

## IDE Setup Recommendations

### VS Code Extensions

1. **TypeScript**: Built-in TypeScript support
2. **ESLint**: Real-time linting
3. **Prettier**: Auto-formatting
4. **Error Lens**: Inline error display

### VS Code Settings

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "typescript.preferences.includePackageJsonAutoImports": "auto"
}
```

## Troubleshooting

### Common Scenarios

1. **Commit Blocked by TypeScript Errors**:

   ```bash
   npm run type-check
   # Fix reported errors
   git add .
   git commit -m "Fix TypeScript errors"
   ```

2. **ESLint Warnings**:

   ```bash
   npm run lint -- --fix
   # Review remaining warnings
   git add .
   git commit
   ```

3. **Build Failures in CI/CD**:
   - Check CI logs for specific errors
   - Run same commands locally: `npm run build`
   - Ensure all dependencies are up to date

## Emergency Bypass (Use Sparingly)

If you need to bypass checks temporarily:

```bash
# Skip pre-commit hooks (NOT RECOMMENDED)
git commit --no-verify -m "Emergency fix"

# Skip specific ESLint rules (TEMPORARY ONLY)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unusedVariable = 'temp'
```

## Getting Help

1. **Check this guide first**
2. **Run diagnostic commands**:

   ```bash
   npm run type-check
   npm run lint
   ```

3. **Review error messages carefully**
4. **Check recent changes** that might have introduced issues

## Updates & Maintenance

This document should be updated when:

- New TypeScript/ESLint rules are added
- Development workflow changes
- Common patterns evolve

Last updated: 2025-08-19
