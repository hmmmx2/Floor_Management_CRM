"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export type Session = {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  role: string;
  status: "active" | "inactive";
  password?: string;
  twoFactorEnabled?: boolean;
  passwordLastChanged?: string;
  notifications?: boolean;
  emailAlerts?: boolean;
  smsAlerts?: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessions: Session[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
  toggleTwoFactor: () => Promise<{ success: boolean; enabled: boolean }>;
  terminateSession: (sessionId: string) => void;
  terminateAllOtherSessions: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate session info based on user agent
function generateSessionInfo(): Omit<Session, "id" | "isCurrent" | "lastActive"> {
  if (typeof window === "undefined") {
    return { device: "Unknown", browser: "Unknown", location: "Unknown" };
  }
  
  const ua = navigator.userAgent;
  let browser = "Unknown";
  let device = "Desktop";
  
  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Edge")) browser = "Edge";
  
  if (ua.includes("Windows")) device = "Windows";
  else if (ua.includes("Mac")) device = "macOS";
  else if (ua.includes("Linux")) device = "Linux";
  else if (ua.includes("Android")) device = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) device = "iOS";
  
  return {
    device,
    browser,
    location: "Kuching, Sarawak", // In production, use geolocation API
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize default admin user and load user from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Initialize default admin user if no users exist or update existing default admin
        const registeredUsers = localStorage.getItem("flood_registered_users");
        const defaultAdmin: User = {
          id: "user-admin-default",
          name: "Alwin Tay",
          email: "alwintay@floodmanagement.com",
          password: "admin123",
          phone: "+60 12-345 6789",
          department: "Operations",
          role: "Admin",
          status: "active",
          twoFactorEnabled: false,
          passwordLastChanged: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          notifications: true,
          emailAlerts: true,
          smsAlerts: false,
        };
        
        if (!registeredUsers) {
          localStorage.setItem("flood_registered_users", JSON.stringify([defaultAdmin]));
        } else {
          const users: User[] = JSON.parse(registeredUsers);
          const adminIndex = users.findIndex((u) => u.id === "user-admin-default");
          if (adminIndex >= 0) {
            // Preserve password if it was changed
            const existingPassword = users[adminIndex].password;
            const existingPasswordLastChanged = users[adminIndex].passwordLastChanged;
            users[adminIndex] = { 
              ...defaultAdmin, 
              password: existingPassword || defaultAdmin.password,
              passwordLastChanged: existingPasswordLastChanged || defaultAdmin.passwordLastChanged,
            };
          } else {
            users.unshift(defaultAdmin);
          }
          localStorage.setItem("flood_registered_users", JSON.stringify(users));
        }

        // Load user session
        const storedUser = localStorage.getItem("flood_auth_user");
        const storedSession = localStorage.getItem("flood_auth_session");
        
        if (storedUser && storedSession) {
          const sessionData = JSON.parse(storedSession);
          if (Date.now() - sessionData.timestamp < 24 * 60 * 60 * 1000) {
            const userData = JSON.parse(storedUser);
            const { password, ...userWithoutPassword } = userData;
            setUser(userWithoutPassword as User);
            
            // Load sessions
            const storedSessions = localStorage.getItem(`flood_sessions_${userData.id}`);
            if (storedSessions) {
              setSessions(JSON.parse(storedSessions));
            }
          } else {
            localStorage.removeItem("flood_auth_user");
            localStorage.removeItem("flood_auth_session");
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const registeredUsers = localStorage.getItem("flood_registered_users");
      const users = registeredUsers ? JSON.parse(registeredUsers) : [];
      const foundUser = users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());

      if (!foundUser) {
        return { success: false, error: "Invalid email or password" };
      }

      if (foundUser.password !== password) {
        return { success: false, error: "Invalid email or password" };
      }

      if (foundUser.status === "inactive") {
        return { success: false, error: "Your account has been deactivated. Please contact an administrator." };
      }

      // Create session
      const sessionInfo = generateSessionInfo();
      const newSession: Session = {
        id: `session-${Date.now()}`,
        ...sessionInfo,
        lastActive: new Date().toISOString(),
        isCurrent: true,
      };

      // Load existing sessions and add new one
      const existingSessions = localStorage.getItem(`flood_sessions_${foundUser.id}`);
      let userSessions: Session[] = existingSessions ? JSON.parse(existingSessions) : [];
      
      // Mark all existing sessions as not current
      userSessions = userSessions.map(s => ({ ...s, isCurrent: false }));
      userSessions.unshift(newSession);
      
      // Keep only last 10 sessions
      if (userSessions.length > 10) {
        userSessions = userSessions.slice(0, 10);
      }
      
      localStorage.setItem(`flood_sessions_${foundUser.id}`, JSON.stringify(userSessions));
      setSessions(userSessions);

      const sessionData = {
        userId: foundUser.id,
        sessionId: newSession.id,
        timestamp: Date.now(),
      };

      const { password: _, ...userWithoutPassword } = foundUser;
      
      localStorage.setItem("flood_auth_user", JSON.stringify(foundUser));
      localStorage.setItem("flood_auth_session", JSON.stringify(sessionData));
      
      setUser(userWithoutPassword as User);
      
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An error occurred during login. Please try again." };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!name.trim()) {
        return { success: false, error: "Name is required" };
      }

      if (!email.trim() || !email.includes("@")) {
        return { success: false, error: "Valid email is required" };
      }

      if (password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters" };
      }

      if (password !== confirmPassword) {
        return { success: false, error: "Passwords do not match" };
      }

      const registeredUsers = localStorage.getItem("flood_registered_users");
      const users: User[] = registeredUsers ? JSON.parse(registeredUsers) : [];

      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: "Email already registered" };
      }

      const savedRoles = localStorage.getItem("flood_roles");
      const roles = savedRoles ? JSON.parse(savedRoles) : [];
      const defaultRole = roles.find((r: any) => r.name === "Viewer") || { name: "Viewer" };

      const newUser: User = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        role: defaultRole.name,
        status: "active",
        twoFactorEnabled: false,
        passwordLastChanged: new Date().toISOString(),
        notifications: true,
        emailAlerts: true,
        smsAlerts: false,
      };

      users.push(newUser);
      localStorage.setItem("flood_registered_users", JSON.stringify(users));

      const roleUsers = localStorage.getItem("flood_users");
      if (roleUsers) {
        const existingRoleUsers = JSON.parse(roleUsers);
        const roleUserEntry = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
          lastActive: "Just now",
        };
        existingRoleUsers.push(roleUserEntry);
        localStorage.setItem("flood_users", JSON.stringify(existingRoleUsers));

        const updatedRoles = roles.map((r: any) =>
          r.name === newUser.role ? { ...r, usersCount: r.usersCount + 1 } : r
        );
        localStorage.setItem("flood_roles", JSON.stringify(updatedRoles));
      }

      // Create initial session
      const sessionInfo = generateSessionInfo();
      const newSession: Session = {
        id: `session-${Date.now()}`,
        ...sessionInfo,
        lastActive: new Date().toISOString(),
        isCurrent: true,
      };
      localStorage.setItem(`flood_sessions_${newUser.id}`, JSON.stringify([newSession]));
      setSessions([newSession]);

      const sessionData = {
        userId: newUser.id,
        sessionId: newSession.id,
        timestamp: Date.now(),
      };

      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem("flood_auth_user", JSON.stringify(newUser));
      localStorage.setItem("flood_auth_session", JSON.stringify(sessionData));
      
      setUser(userWithoutPassword as User);

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "An error occurred during registration. Please try again." };
    }
  };

  const logout = () => {
    // Mark current session as ended
    if (user) {
      const storedSessions = localStorage.getItem(`flood_sessions_${user.id}`);
      if (storedSessions) {
        const userSessions: Session[] = JSON.parse(storedSessions);
        const updatedSessions = userSessions.filter(s => !s.isCurrent);
        localStorage.setItem(`flood_sessions_${user.id}`, JSON.stringify(updatedSessions));
      }
    }
    
    localStorage.removeItem("flood_auth_user");
    localStorage.removeItem("flood_auth_session");
    setUser(null);
    setSessions([]);
    router.push("/login");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      const { password: _, ...userWithoutPassword } = updatedUser;
      setUser(userWithoutPassword as User);
      
      const registeredUsers = localStorage.getItem("flood_registered_users");
      if (registeredUsers) {
        const users: User[] = JSON.parse(registeredUsers);
        const userIndex = users.findIndex((u) => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...userData };
          localStorage.setItem("flood_registered_users", JSON.stringify(users));
          localStorage.setItem("flood_auth_user", JSON.stringify(users[userIndex]));
        }
      }
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const registeredUsers = localStorage.getItem("flood_registered_users");
    if (!registeredUsers) {
      return { success: false, error: "User not found" };
    }

    const users: User[] = JSON.parse(registeredUsers);
    const userIndex = users.findIndex((u) => u.id === user.id);
    
    if (userIndex === -1) {
      return { success: false, error: "User not found" };
    }

    if (users[userIndex].password !== currentPassword) {
      return { success: false, error: "Current password is incorrect" };
    }

    if (newPassword.length < 6) {
      return { success: false, error: "New password must be at least 6 characters" };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: "New passwords do not match" };
    }

    if (newPassword === currentPassword) {
      return { success: false, error: "New password must be different from current password" };
    }

    // Update password
    users[userIndex].password = newPassword;
    users[userIndex].passwordLastChanged = new Date().toISOString();
    localStorage.setItem("flood_registered_users", JSON.stringify(users));
    localStorage.setItem("flood_auth_user", JSON.stringify(users[userIndex]));
    
    // Update user state with new passwordLastChanged
    setUser(prev => prev ? { ...prev, passwordLastChanged: users[userIndex].passwordLastChanged } : null);

    return { success: true };
  };

  const toggleTwoFactor = async (): Promise<{ success: boolean; enabled: boolean }> => {
    if (!user) {
      return { success: false, enabled: false };
    }

    const newValue = !user.twoFactorEnabled;
    updateUser({ twoFactorEnabled: newValue });
    
    return { success: true, enabled: newValue };
  };

  const terminateSession = (sessionId: string) => {
    if (!user) return;
    
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    localStorage.setItem(`flood_sessions_${user.id}`, JSON.stringify(updatedSessions));
  };

  const terminateAllOtherSessions = () => {
    if (!user) return;
    
    const currentSession = sessions.find(s => s.isCurrent);
    const updatedSessions = currentSession ? [currentSession] : [];
    setSessions(updatedSessions);
    localStorage.setItem(`flood_sessions_${user.id}`, JSON.stringify(updatedSessions));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        sessions,
        login,
        register,
        logout,
        updateUser,
        changePassword,
        toggleTwoFactor,
        terminateSession,
        terminateAllOtherSessions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
