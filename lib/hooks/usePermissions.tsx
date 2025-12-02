"use client";

import { useMemo } from "react";
import { useAuth } from "@/lib/AuthContext";
import {
  Permission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  canAccessPage,
  canExportData,
  canManageSensors,
  canManageAlerts,
  canManageRoles,
  canManageUsers,
  getAccessibleNavItems,
  NavItem,
} from "@/lib/permissions";

export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role || "";

  const permissions = useMemo(() => {
    return {
      // Core permission checks
      can: (permission: Permission) => hasPermission(role, permission),
      canAny: (permissions: Permission[]) => hasAnyPermission(role, permissions),
      canAll: (permissions: Permission[]) => hasAllPermissions(role, permissions),
      
      // Get all permissions for current user
      all: getRolePermissions(role),
      
      // Page access
      canAccessPage: (pathname: string) => canAccessPage(role, pathname),
      
      // Feature-specific checks
      canExport: canExportData(role),
      canManageSensors: canManageSensors(role),
      canManageAlerts: canManageAlerts(role),
      canManageRoles: canManageRoles(role),
      canManageUsers: canManageUsers(role),
      
      // Navigation
      accessibleNavItems: getAccessibleNavItems(role),
      
      // Role info
      role,
      isAdmin: role === "Admin",
      isOperationsManager: role === "Operations Manager",
      isFieldTechnician: role === "Field Technician",
      isViewer: role === "Viewer",
    };
  }, [role]);

  return permissions;
}

// Higher-order component for permission-based rendering
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermission: Permission
) {
  return function PermissionWrapper(props: P) {
    const { can } = usePermissions();
    
    if (!can(requiredPermission)) {
      return null;
    }
    
    return <WrappedComponent {...props} />;
  };
}

