import { renderHook } from '@testing-library/react';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { AuthProvider } from '@/lib/AuthContext';
import { ReactNode } from 'react';

// Mock user in localStorage
const createWrapper = (userRole: string) => {
  return ({ children }: { children: ReactNode }) => {
    const testUser = {
      id: 'test-user',
      name: 'Test User',
      email: 'test@example.com',
      role: userRole,
      status: 'active' as const,
    };
    localStorage.setItem('flood_registered_users', JSON.stringify([testUser]));
    localStorage.setItem('flood_auth_user', JSON.stringify(testUser));
    localStorage.setItem('flood_auth_session', JSON.stringify({ userId: testUser.id, timestamp: Date.now() }));
    
    return <AuthProvider>{children}</AuthProvider>;
  };
};

describe('usePermissions', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('returns correct permissions for Admin role', () => {
    const { result } = renderHook(() => usePermissions(), {
      wrapper: createWrapper('Admin'),
    });

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.can('dashboard.view')).toBe(true);
    expect(result.current.can('sensors.view')).toBe(true);
    expect(result.current.can('roles.manage')).toBe(true);
  });

  it('returns correct permissions for Viewer role', () => {
    const { result } = renderHook(() => usePermissions(), {
      wrapper: createWrapper('Viewer'),
    });

    expect(result.current.isViewer).toBe(true);
    expect(result.current.can('dashboard.view')).toBe(true);
    expect(result.current.can('roles.manage')).toBe(false);
  });

  it('returns correct permissions for Operations Manager', () => {
    const { result } = renderHook(() => usePermissions(), {
      wrapper: createWrapper('Operations Manager'),
    });

    expect(result.current.isOperationsManager).toBe(true);
    expect(result.current.can('dashboard.view')).toBe(true);
    expect(result.current.can('sensors.view')).toBe(true);
  });

  it('canAny returns true if any permission matches', () => {
    const { result } = renderHook(() => usePermissions(), {
      wrapper: createWrapper('Viewer'),
    });

    expect(result.current.canAny(['roles.manage', 'dashboard.view'])).toBe(true);
    expect(result.current.canAny(['roles.manage', 'sensors.manage'])).toBe(false);
  });

  it('canAll returns true only if all permissions match', () => {
    const { result } = renderHook(() => usePermissions(), {
      wrapper: createWrapper('Operations Manager'),
    });

    expect(result.current.canAll(['dashboard.view', 'sensors.view'])).toBe(true);
    // Operations Manager doesn't have roles.manage
    expect(result.current.canAll(['dashboard.view', 'roles.manage'])).toBe(false);
  });
});

