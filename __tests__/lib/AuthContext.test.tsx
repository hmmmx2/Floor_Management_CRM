import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('initializes with no user when not logged in', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('logs in successfully with valid credentials', async () => {
    // Setup: Create a user in localStorage
    const testUser = {
      id: 'test-user-1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'Admin',
      status: 'active' as const,
    };
    localStorage.setItem('flood_registered_users', JSON.stringify([testUser]));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const loginResult = await result.current.login('test@example.com', 'password123');
      expect(loginResult.success).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.email).toBe('test@example.com');
    });
  });

  it('fails login with invalid credentials', async () => {
    const testUser = {
      id: 'test-user-1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'Admin',
      status: 'active' as const,
    };
    localStorage.setItem('flood_registered_users', JSON.stringify([testUser]));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const loginResult = await result.current.login('test@example.com', 'wrongpassword');
      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBeDefined();
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logs out successfully', async () => {
    const testUser = {
      id: 'test-user-1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'Admin',
      status: 'active' as const,
    };
    localStorage.setItem('flood_registered_users', JSON.stringify([testUser]));
    localStorage.setItem('flood_auth_user', JSON.stringify(testUser));
    localStorage.setItem('flood_auth_session', JSON.stringify({ userId: testUser.id, timestamp: Date.now() }));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    act(() => {
      result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });
  });

  it('updates user information', async () => {
    const testUser = {
      id: 'test-user-1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'Admin',
      status: 'active' as const,
    };
    localStorage.setItem('flood_registered_users', JSON.stringify([testUser]));
    localStorage.setItem('flood_auth_user', JSON.stringify(testUser));
    localStorage.setItem('flood_auth_session', JSON.stringify({ userId: testUser.id, timestamp: Date.now() }));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    act(() => {
      result.current.updateUser({ name: 'Updated Name', phone: '+60123456789' });
    });

    await waitFor(() => {
      expect(result.current.user?.name).toBe('Updated Name');
      expect(result.current.user?.phone).toBe('+60123456789');
    });
  });

  it('changes password successfully', async () => {
    const testUser = {
      id: 'test-user-1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'oldpassword',
      role: 'Admin',
      status: 'active' as const,
    };
    localStorage.setItem('flood_registered_users', JSON.stringify([testUser]));
    localStorage.setItem('flood_auth_user', JSON.stringify(testUser));
    localStorage.setItem('flood_auth_session', JSON.stringify({ userId: testUser.id, timestamp: Date.now() }));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    await act(async () => {
      const changeResult = await result.current.changePassword(
        'oldpassword',
        'newpassword123',
        'newpassword123'
      );
      expect(changeResult.success).toBe(true);
    });
  });

  it('fails password change with wrong current password', async () => {
    const testUser = {
      id: 'test-user-1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'oldpassword',
      role: 'Admin',
      status: 'active' as const,
    };
    localStorage.setItem('flood_registered_users', JSON.stringify([testUser]));
    localStorage.setItem('flood_auth_user', JSON.stringify(testUser));
    localStorage.setItem('flood_auth_session', JSON.stringify({ userId: testUser.id, timestamp: Date.now() }));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    await act(async () => {
      const changeResult = await result.current.changePassword(
        'wrongpassword',
        'newpassword123',
        'newpassword123'
      );
      expect(changeResult.success).toBe(false);
      expect(changeResult.error).toContain('incorrect');
    });
  });
});

