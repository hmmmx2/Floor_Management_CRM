// Role-Based Access Control (RBAC) System

export type Permission =
  | "all"
  | "dashboard.view"
  | "sensors.manage"
  | "sensors.view"
  | "sensors.export"
  | "alerts.manage"
  | "alerts.view"
  | "analytics.view"
  | "map.view"
  | "roles.manage"
  | "users.manage"
  | "settings.manage";

export type RoleName = 
  | "Admin" 
  | "Operations Manager" 
  | "Field Technician" 
  | "Viewer";

// Define what each role can do
export const rolePermissions: Record<RoleName, Permission[]> = {
  Admin: ["all"],
  "Operations Manager": [
    "dashboard.view",
    "sensors.manage",
    "sensors.view",
    "sensors.export",
    "alerts.manage",
    "alerts.view",
    "analytics.view",
    "map.view",
  ],
  "Field Technician": [
    "dashboard.view",
    "sensors.view",
    "alerts.view",
    "map.view",
  ],
  Viewer: [
    "dashboard.view",
    "analytics.view",
  ],
};

// Permission descriptions for UI
export const permissionDescriptions: Record<Permission, string> = {
  all: "Full system access with all permissions",
  "dashboard.view": "View dashboard and statistics",
  "sensors.manage": "Add, edit, and delete sensors",
  "sensors.view": "View sensor data and status",
  "sensors.export": "Export sensor data to CSV/Excel",
  "alerts.manage": "Acknowledge and manage alerts",
  "alerts.view": "View alerts and notifications",
  "analytics.view": "View analytics and reports",
  "map.view": "View flood map and locations",
  "roles.manage": "Manage user roles and permissions",
  "users.manage": "Add, edit, and remove users",
  "settings.manage": "Manage system settings",
};

// Check if a role has a specific permission
export function hasPermission(role: string, permission: Permission): boolean {
  const rolePerms = rolePermissions[role as RoleName];
  
  if (!rolePerms) return false;
  
  // Admin has all permissions
  if (rolePerms.includes("all")) return true;
  
  return rolePerms.includes(permission);
}

// Check if a role has any of the specified permissions
export function hasAnyPermission(role: string, permissions: Permission[]): boolean {
  return permissions.some((perm) => hasPermission(role, perm));
}

// Check if a role has all of the specified permissions
export function hasAllPermissions(role: string, permissions: Permission[]): boolean {
  return permissions.every((perm) => hasPermission(role, perm));
}

// Get all permissions for a role
export function getRolePermissions(role: string): Permission[] {
  const rolePerms = rolePermissions[role as RoleName];
  
  if (!rolePerms) return [];
  
  // If role has "all" permission, return all possible permissions
  if (rolePerms.includes("all")) {
    return Object.keys(permissionDescriptions) as Permission[];
  }
  
  return rolePerms;
}

// Navigation items with required permissions
export type NavItem = {
  label: string;
  href: string;
  permission: Permission;
};

export const navigationItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", permission: "dashboard.view" },
  { label: "Sensors", href: "/sensors", permission: "sensors.view" },
  { label: "Flood Map", href: "/map", permission: "map.view" },
  { label: "Analytics", href: "/analytics", permission: "analytics.view" },
  { label: "Alerts", href: "/alerts", permission: "alerts.view" },
  { label: "Role Management", href: "/roles", permission: "roles.manage" },
];

// Filter navigation items based on user role
export function getAccessibleNavItems(role: string): NavItem[] {
  return navigationItems.filter((item) => hasPermission(role, item.permission));
}

// Page access control
export const pagePermissions: Record<string, Permission> = {
  "/dashboard": "dashboard.view",
  "/sensors": "sensors.view",
  "/map": "map.view",
  "/analytics": "analytics.view",
  "/alerts": "alerts.view",
  "/roles": "roles.manage",
  "/admin": "dashboard.view", // Account settings - everyone can access their own
  "/settings": "settings.manage",
};

// Check if user can access a specific page
export function canAccessPage(role: string, pathname: string): boolean {
  // Account settings is accessible to all logged-in users
  if (pathname === "/admin") return true;
  
  const requiredPermission = pagePermissions[pathname];
  
  if (!requiredPermission) return true; // Allow if no permission defined
  
  return hasPermission(role, requiredPermission);
}

// Feature flags based on permissions
export function canExportData(role: string): boolean {
  return hasPermission(role, "sensors.export") || hasPermission(role, "all");
}

export function canManageSensors(role: string): boolean {
  return hasPermission(role, "sensors.manage");
}

export function canManageAlerts(role: string): boolean {
  return hasPermission(role, "alerts.manage");
}

export function canManageRoles(role: string): boolean {
  return hasPermission(role, "roles.manage");
}

export function canManageUsers(role: string): boolean {
  return hasPermission(role, "users.manage") || hasPermission(role, "all");
}

