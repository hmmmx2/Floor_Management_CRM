# Testing Guide

This project includes comprehensive unit tests and E2E tests to ensure code quality and prevent bugs.

## Test Structure

### Unit Tests (Jest + React Testing Library)
- **Location:** `__tests__/`
- **Components:** `__tests__/components/`
- **Hooks:** `__tests__/lib/hooks/`
- **API Routes:** `__tests__/api/`
- **Contexts:** `__tests__/lib/`

### E2E Tests (Playwright)
- **Location:** `e2e/`
- Tests critical user flows: authentication, dashboard, sensors, alerts, settings

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui
```

## Test Coverage

Current test coverage includes:

### ✅ Components
- StatusPill - Status indicator component
- OverviewCard - KPI card component

### ✅ Authentication
- Login flow
- Logout flow
- User session management
- Password change
- User profile updates

### ✅ Permissions
- Role-based access control
- Permission checking (can, canAny, canAll)
- Role detection (Admin, Viewer, etc.)

### ✅ API Routes
- `/api/nodes` - MongoDB data fetching
- Error handling
- Data transformation

### ✅ E2E Flows
- Authentication (login/logout)
- Dashboard navigation
- Sensors page functionality
- Alerts page with filters
- Settings configuration

## Test Results

**Current Status:** ✅ All 28 unit tests passing

```
Test Suites: 5 passed, 5 total
Tests:       28 passed, 28 total
```

## Writing New Tests

### Component Test Example
```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent prop="value" />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Hook Test Example
```typescript
import { renderHook } from '@testing-library/react';
import { useMyHook } from '@/lib/hooks/useMyHook';

describe('useMyHook', () => {
  it('returns expected value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe('expected');
  });
});
```

## Continuous Integration

Tests should be run:
- Before committing code
- In CI/CD pipeline
- Before deploying to production

## Known Issues

None - all tests passing! ✅

