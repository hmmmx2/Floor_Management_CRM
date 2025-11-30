"use client";

import { useEffect, useState } from "react";

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  usersCount: number;
  color: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastActive: string;
};

const defaultRoles: Role[] = [
  {
    id: "role-1",
    name: "Admin",
    description: "Full system access with all permissions",
    permissions: ["all"],
    usersCount: 1,
    color: "bg-primary-red",
  },
  {
    id: "role-2",
    name: "Operations Manager",
    description: "Manage sensors, alerts, and view analytics",
    permissions: ["sensors.manage", "alerts.manage", "analytics.view", "map.view"],
    usersCount: 3,
    color: "bg-status-warning-2",
  },
  {
    id: "role-3",
    name: "Field Technician",
    description: "View sensors and respond to alerts",
    permissions: ["sensors.view", "alerts.view", "map.view"],
    usersCount: 8,
    color: "bg-status-green",
  },
  {
    id: "role-4",
    name: "Viewer",
    description: "Read-only access to dashboard and reports",
    permissions: ["dashboard.view", "analytics.view"],
    usersCount: 0,
    color: "bg-light-grey",
  },
];

const defaultUsers: User[] = [
  {
    id: "user-1",
    name: "Ahmad bin Abdullah",
    email: "ahmad@floodmanagement.my",
    role: "Admin",
    status: "active",
    lastActive: "Just now",
  },
  {
    id: "user-2",
    name: "Siti Nurhaliza",
    email: "siti@floodmanagement.my",
    role: "Operations Manager",
    status: "active",
    lastActive: "5 mins ago",
  },
  {
    id: "user-3",
    name: "Raj Kumar",
    email: "raj@floodmanagement.my",
    role: "Field Technician",
    status: "active",
    lastActive: "1 hour ago",
  },
  {
    id: "user-4",
    name: "Lee Wei Ming",
    email: "weiming@floodmanagement.my",
    role: "Field Technician",
    status: "inactive",
    lastActive: "2 days ago",
  },
  {
    id: "user-5",
    name: "Fatimah Zahra",
    email: "fatimah@floodmanagement.my",
    role: "Viewer",
    status: "active",
    lastActive: "30 mins ago",
  },
];

const allPermissions = [
  { key: "all", label: "Full Access" },
  { key: "dashboard.view", label: "View Dashboard" },
  { key: "sensors.manage", label: "Manage Sensors" },
  { key: "sensors.view", label: "View Sensors" },
  { key: "alerts.manage", label: "Manage Alerts" },
  { key: "alerts.view", label: "View Alerts" },
  { key: "analytics.view", label: "View Analytics" },
  { key: "map.view", label: "View Map" },
  { key: "roles.manage", label: "Manage Roles" },
];

const roleColors = [
  "bg-primary-red",
  "bg-status-warning-2",
  "bg-status-green",
  "bg-light-grey",
  "bg-status-warning-1",
  "bg-status-danger",
];

const permissionLabels: Record<string, string> = {
  all: "Full Access",
  "sensors.manage": "Manage Sensors",
  "sensors.view": "View Sensors",
  "alerts.manage": "Manage Alerts",
  "alerts.view": "View Alerts",
  "analytics.view": "View Analytics",
  "map.view": "View Map",
  "dashboard.view": "View Dashboard",
  "roles.manage": "Manage Roles",
};

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [activeTab, setActiveTab] = useState<"roles" | "users">("roles");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // New role form state
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
    color: "bg-primary-red",
  });

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Viewer",
    status: "active" as "active" | "inactive",
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedRoles = localStorage.getItem("flood_roles");
    const savedUsers = localStorage.getItem("flood_users");
    if (savedRoles) {
      setRoles(JSON.parse(savedRoles));
    }
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  // Save to localStorage whenever roles or users change
  const saveToStorage = (newRoles: Role[], newUsers: User[]) => {
    localStorage.setItem("flood_roles", JSON.stringify(newRoles));
    localStorage.setItem("flood_users", JSON.stringify(newUsers));
  };

  const handleAddRole = () => {
    if (!newRole.name.trim()) {
      setSaveMessage("Role name is required");
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsSaving(true);

    const role: Role = {
      id: `role-${Date.now()}`,
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions.length > 0 ? newRole.permissions : ["dashboard.view"],
      usersCount: 0,
      color: newRole.color,
    };

    const updatedRoles = [...roles, role];
    setRoles(updatedRoles);
    saveToStorage(updatedRoles, users);

    // Reset form
    setNewRole({
      name: "",
      description: "",
      permissions: [],
      color: "bg-primary-red",
    });
    setShowAddRoleModal(false);
    setIsSaving(false);
    setSaveMessage("Role added successfully!");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleDeleteRole = (roleId: string) => {
    const roleToDelete = roles.find((r) => r.id === roleId);
    if (roleToDelete?.name === "Admin") {
      setSaveMessage("Cannot delete Admin role");
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    const updatedRoles = roles.filter((r) => r.id !== roleId);
    setRoles(updatedRoles);
    saveToStorage(updatedRoles, users);
    setSelectedRole(null);
    setSaveMessage("Role deleted successfully!");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      setSaveMessage("Name and email are required");
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsSaving(true);

    const user: User = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      lastActive: "Just now",
    };

    const updatedUsers = [...users, user];

    // Update user count for the role
    const updatedRoles = roles.map((r) =>
      r.name === newUser.role ? { ...r, usersCount: r.usersCount + 1 } : r
    );

    setUsers(updatedUsers);
    setRoles(updatedRoles);
    saveToStorage(updatedRoles, updatedUsers);

    // Reset form
    setNewUser({
      name: "",
      email: "",
      role: "Viewer",
      status: "active",
    });
    setShowAddUserModal(false);
    setIsSaving(false);
    setSaveMessage("User added successfully!");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleRemoveUser = (userId: string) => {
    const userToRemove = users.find((u) => u.id === userId);
    if (!userToRemove) return;

    const updatedUsers = users.filter((u) => u.id !== userId);

    // Update user count for the role
    const updatedRoles = roles.map((r) =>
      r.name === userToRemove.role && r.usersCount > 0
        ? { ...r, usersCount: r.usersCount - 1 }
        : r
    );

    setUsers(updatedUsers);
    setRoles(updatedRoles);
    saveToStorage(updatedRoles, updatedUsers);
    setSaveMessage("User removed successfully!");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const togglePermission = (perm: string) => {
    setNewRole((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  return (
    <section className="space-y-6">
      {/* Success/Error Message */}
      {saveMessage && (
        <div
          className={`fixed top-20 right-6 z-50 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg ${
            saveMessage.includes("successfully")
              ? "bg-status-green text-pure-white"
              : "bg-primary-red text-pure-white"
          }`}
        >
          {saveMessage}
        </div>
      )}

      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-dark-charcoal">
            Role Management
          </h1>
          <p className="text-sm text-dark-charcoal/70">
            Manage user roles, permissions, and access control.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            activeTab === "roles"
              ? setShowAddRoleModal(true)
              : setShowAddUserModal(true)
          }
          className="flex items-center gap-2 rounded-xl bg-primary-red px-4 py-2.5 text-sm font-semibold text-pure-white transition hover:bg-primary-red/90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M12 4a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H5a1 1 0 110-2h6V5a1 1 0 011-1z" />
          </svg>
          {activeTab === "roles" ? "Add Role" : "Add User"}
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("roles")}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            activeTab === "roles"
              ? "bg-primary-red text-pure-white"
              : "border border-light-grey text-dark-charcoal hover:border-primary-red/60"
          }`}
        >
          Roles ({roles.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            activeTab === "users"
              ? "bg-primary-red text-pure-white"
              : "border border-light-grey text-dark-charcoal hover:border-primary-red/60"
          }`}
        >
          Users ({users.length})
        </button>
      </div>

      {activeTab === "roles" ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Roles List */}
          <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-dark-charcoal">
              System Roles
            </h2>
            <p className="text-xs text-dark-charcoal/60">
              Click a role to view permissions
            </p>
            <div className="mt-4 space-y-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedRole?.id === role.id
                      ? "border-primary-red bg-light-red/20"
                      : "border-light-grey hover:border-primary-red/40"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${role.color}`} />
                      <div>
                        <p className="font-semibold text-dark-charcoal">
                          {role.name}
                        </p>
                        <p className="text-xs text-dark-charcoal/60">
                          {role.description}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-very-light-grey px-2.5 py-1 text-xs font-semibold text-dark-charcoal">
                      {role.usersCount} user{role.usersCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </article>

          {/* Permissions Panel */}
          <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-dark-charcoal">
              Permissions
            </h2>
            {selectedRole ? (
              <>
                <p className="text-xs text-dark-charcoal/60">
                  {selectedRole.name} has access to:
                </p>
                <div className="mt-4 space-y-2">
                  {selectedRole.permissions.map((perm) => (
                    <div
                      key={perm}
                      className="flex items-center gap-2 rounded-xl bg-very-light-grey px-3 py-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4 text-status-green"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                      <span className="text-sm font-medium text-dark-charcoal">
                        {permissionLabels[perm] || perm}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  {selectedRole.name !== "Admin" && (
                    <button
                      type="button"
                      onClick={() => handleDeleteRole(selectedRole.id)}
                      className="flex-1 rounded-xl border border-primary-red px-4 py-2 text-sm font-semibold text-primary-red transition hover:bg-light-red/20"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-dark-charcoal/60">
                Select a role to view its permissions.
              </p>
            )}
          </article>
        </div>
      ) : (
        /* Users Table */
        <article className="rounded-3xl border border-light-grey bg-pure-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-dark-charcoal">
                All Users
              </h2>
              <p className="text-xs text-dark-charcoal/60">
                Manage user accounts and role assignments
              </p>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-very-light-grey text-xs uppercase text-dark-charcoal">
                <tr>
                  <th className="rounded-l-xl px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Last Active</th>
                  <th className="rounded-r-xl px-4 py-3 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-light-grey/60 last:border-b-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-light-red/40 text-sm font-bold text-primary-red">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-dark-charcoal">
                            {user.name}
                          </p>
                          <p className="text-xs text-dark-charcoal/60">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.role === "Admin"
                            ? "bg-light-red text-primary-red"
                            : user.role === "Operations Manager"
                            ? "bg-status-warning-2/20 text-status-warning-2"
                            : user.role === "Field Technician"
                            ? "bg-status-green/20 text-status-green"
                            : "bg-very-light-grey text-dark-charcoal"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            user.status === "active"
                              ? "bg-status-green"
                              : "bg-light-grey"
                          }`}
                        />
                        <span
                          className={`text-xs font-medium capitalize ${
                            user.status === "active"
                              ? "text-status-green"
                              : "text-dark-charcoal/60"
                          }`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-dark-charcoal/70">
                      {user.lastActive}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleRemoveUser(user.id)}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-primary-red hover:bg-light-red/40"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-light-grey bg-pure-white p-4">
          <p className="text-xs uppercase tracking-wide text-dark-charcoal/60">
            Total Users
          </p>
          <p className="mt-1 text-2xl font-bold text-dark-charcoal">
            {users.length}
          </p>
        </div>
        <div className="rounded-2xl border border-light-grey bg-pure-white p-4">
          <p className="text-xs uppercase tracking-wide text-dark-charcoal/60">
            Active Users
          </p>
          <p className="mt-1 text-2xl font-bold text-status-green">
            {users.filter((u) => u.status === "active").length}
          </p>
        </div>
        <div className="rounded-2xl border border-light-grey bg-pure-white p-4">
          <p className="text-xs uppercase tracking-wide text-dark-charcoal/60">
            Total Roles
          </p>
          <p className="mt-1 text-2xl font-bold text-dark-charcoal">
            {roles.length}
          </p>
        </div>
        <div className="rounded-2xl border border-light-grey bg-pure-white p-4">
          <p className="text-xs uppercase tracking-wide text-dark-charcoal/60">
            Admins
          </p>
          <p className="mt-1 text-2xl font-bold text-primary-red">
            {users.filter((u) => u.role === "Admin").length}
          </p>
        </div>
      </div>

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-charcoal/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-pure-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-dark-charcoal">
              Add New Role
            </h2>
            <p className="text-sm text-dark-charcoal/60">
              Create a new role with specific permissions
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-charcoal">
                  Role Name *
                </label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Supervisor"
                  className="mt-1 w-full rounded-xl border border-light-grey px-4 py-2.5 text-sm text-dark-charcoal outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-charcoal">
                  Description
                </label>
                <input
                  type="text"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of the role"
                  className="mt-1 w-full rounded-xl border border-light-grey px-4 py-2.5 text-sm text-dark-charcoal outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-charcoal">
                  Color
                </label>
                <div className="mt-2 flex gap-2">
                  {roleColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setNewRole((prev) => ({ ...prev, color }))
                      }
                      className={`h-8 w-8 rounded-full ${color} ${
                        newRole.color === color
                          ? "ring-2 ring-dark-charcoal ring-offset-2"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-charcoal">
                  Permissions
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {allPermissions.map((perm) => (
                    <label
                      key={perm.key}
                      className="flex items-center gap-2 rounded-lg border border-light-grey px-3 py-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={newRole.permissions.includes(perm.key)}
                        onChange={() => togglePermission(perm.key)}
                        className="h-4 w-4 rounded border-light-grey text-primary-red focus:ring-primary-red/40"
                      />
                      <span className="text-dark-charcoal">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddRoleModal(false)}
                className="rounded-xl border border-light-grey px-5 py-2.5 text-sm font-semibold text-dark-charcoal transition hover:bg-very-light-grey"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddRole}
                disabled={isSaving}
                className="rounded-xl bg-primary-red px-5 py-2.5 text-sm font-semibold text-pure-white transition hover:bg-primary-red/90 disabled:opacity-50"
              >
                {isSaving ? "Adding..." : "Add Role"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-charcoal/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-pure-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-dark-charcoal">
              Add New User
            </h2>
            <p className="text-sm text-dark-charcoal/60">
              Create a new user account
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-charcoal">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., John Doe"
                  className="mt-1 w-full rounded-xl border border-light-grey px-4 py-2.5 text-sm text-dark-charcoal outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-charcoal">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="e.g., john@example.com"
                  className="mt-1 w-full rounded-xl border border-light-grey px-4 py-2.5 text-sm text-dark-charcoal outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-charcoal">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-light-grey px-4 py-2.5 text-sm text-dark-charcoal outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/20"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-charcoal">
                  Status
                </label>
                <select
                  value={newUser.status}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      status: e.target.value as "active" | "inactive",
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-light-grey px-4 py-2.5 text-sm text-dark-charcoal outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red/20"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="rounded-xl border border-light-grey px-5 py-2.5 text-sm font-semibold text-dark-charcoal transition hover:bg-very-light-grey"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddUser}
                disabled={isSaving}
                className="rounded-xl bg-primary-red px-5 py-2.5 text-sm font-semibold text-pure-white transition hover:bg-primary-red/90 disabled:opacity-50"
              >
                {isSaving ? "Adding..." : "Add User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
