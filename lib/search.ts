// Search index for all pages in the application
export type SearchResult = {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  keywords: string[];
  icon: "dashboard" | "sensors" | "map" | "analytics" | "alerts" | "roles" | "admin" | "settings";
};

// Define searchable pages with their content keywords
export const searchIndex: SearchResult[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Live situational awareness for Sarawak flood defences",
    href: "/dashboard",
    category: "Main",
    icon: "dashboard",
    keywords: [
      "dashboard",
      "overview",
      "kpi",
      "nodes",
      "alerts",
      "water level",
      "hotspot map",
      "time series",
      "analysis",
      "recent activity",
      "flood",
      "total nodes",
      "active",
      "riskiest area",
      "average",
      "telemetry",
      "monthly",
      "state",
      "critical",
      "warning",
      "live",
      "situational",
      "sarawak",
    ],
  },
  {
    id: "sensors",
    title: "Sensors",
    description: "Manage and monitor IoT flood sensors",
    href: "/sensors",
    category: "Main",
    icon: "sensors",
    keywords: [
      "sensors",
      "iot",
      "devices",
      "nodes",
      "water level",
      "status",
      "active",
      "inactive",
      "area",
      "state",
      "timestamp",
      "last update",
      "add sensor",
      "delete",
      "search",
      "filter",
      "sort",
      "table",
      "telemetry",
      "coordinates",
      "longitude",
      "latitude",
      "safe",
      "warning",
      "danger",
    ],
  },
  {
    id: "map",
    title: "Flood Map",
    description: "Interactive map showing sensor locations and flood status",
    href: "/map",
    category: "Main",
    icon: "map",
    keywords: [
      "map",
      "flood map",
      "google maps",
      "location",
      "markers",
      "sensors",
      "coordinates",
      "latitude",
      "longitude",
      "hotspot",
      "area",
      "region",
      "sarawak",
      "kuching",
      "interactive",
      "zoom",
      "status",
      "legend",
      "active nodes",
      "inactive",
      "geolocation",
    ],
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Data analytics, charts, and flood statistics",
    href: "/analytics",
    category: "Insights",
    icon: "analytics",
    keywords: [
      "analytics",
      "charts",
      "graphs",
      "statistics",
      "data",
      "trends",
      "water level",
      "monthly",
      "weekly",
      "daily",
      "area chart",
      "bar chart",
      "pie chart",
      "scatter plot",
      "distribution",
      "high risk",
      "states",
      "mongodb",
      "schema",
      "recommendations",
      "insights",
      "forecast",
      "prediction",
      "analysis",
      "report",
    ],
  },
  {
    id: "alerts",
    title: "Alerts Monitoring",
    description: "Real-time flood alerts and notifications",
    href: "/alerts",
    category: "Insights",
    icon: "alerts",
    keywords: [
      "alerts",
      "notifications",
      "warning",
      "danger",
      "critical",
      "safe",
      "monitoring",
      "real-time",
      "today",
      "yesterday",
      "last week",
      "filter",
      "latest",
      "recent",
      "inactive node",
      "new nodes",
      "water level",
      "threshold",
      "exceeded",
      "rising",
      "falling",
      "emergency",
      "status change",
    ],
  },
  {
    id: "roles",
    title: "Role Management",
    description: "Manage user roles, permissions, and access control",
    href: "/roles",
    category: "Management",
    icon: "roles",
    keywords: [
      "roles",
      "users",
      "permissions",
      "access control",
      "admin",
      "operations manager",
      "field technician",
      "viewer",
      "add role",
      "add user",
      "delete",
      "remove",
      "manage",
      "full access",
      "view dashboard",
      "manage sensors",
      "manage alerts",
      "active",
      "inactive",
      "last active",
      "email",
      "team",
    ],
  },
  {
    id: "admin",
    title: "Admin Settings",
    description: "Manage your account details and notification preferences",
    href: "/admin",
    category: "Management",
    icon: "admin",
    keywords: [
      "admin",
      "settings",
      "account",
      "profile",
      "name",
      "email",
      "phone",
      "department",
      "notifications",
      "push notifications",
      "email alerts",
      "sms alerts",
      "security",
      "password",
      "two-factor",
      "2fa",
      "sessions",
      "activity",
      "preferences",
      "save",
      "reset",
    ],
  },
  {
    id: "settings",
    title: "CRM Settings",
    description: "Configure system settings, integrations, and preferences",
    href: "/settings",
    category: "Management",
    icon: "settings",
    keywords: [
      "settings",
      "crm",
      "configuration",
      "general",
      "notifications",
      "data management",
      "integrations",
      "security",
      "appearance",
      "theme",
      "dark mode",
      "light mode",
      "map settings",
      "backup",
      "restore",
      "export",
      "import",
      "api",
      "webhook",
      "timezone",
      "language",
      "retention",
      "cleanup",
    ],
  },
];

// Search function that matches query against keywords
export function searchPages(query: string): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const searchTerms = query.toLowerCase().trim().split(/\s+/);

  // Score each page based on keyword matches
  const scoredResults = searchIndex.map((page) => {
    let score = 0;
    const allKeywords = [
      page.title.toLowerCase(),
      page.description.toLowerCase(),
      page.category.toLowerCase(),
      ...page.keywords,
    ].join(" ");

    for (const term of searchTerms) {
      // Exact title match - highest priority
      if (page.title.toLowerCase() === term) {
        score += 100;
      }
      // Title contains term
      else if (page.title.toLowerCase().includes(term)) {
        score += 50;
      }
      // Description contains term
      if (page.description.toLowerCase().includes(term)) {
        score += 30;
      }
      // Keyword exact match
      if (page.keywords.includes(term)) {
        score += 20;
      }
      // Keyword partial match
      else if (page.keywords.some((kw) => kw.includes(term))) {
        score += 10;
      }
      // Any content contains term
      else if (allKeywords.includes(term)) {
        score += 5;
      }
    }

    return { page, score };
  });

  // Filter out zero scores and sort by score descending
  return scoredResults
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.page);
}

// Get suggested searches based on partial input
export function getSuggestions(query: string, limit = 5): string[] {
  if (!query.trim()) {
    return [];
  }

  const term = query.toLowerCase().trim();
  const suggestions = new Set<string>();

  for (const page of searchIndex) {
    // Add matching keywords as suggestions
    for (const keyword of page.keywords) {
      if (keyword.startsWith(term) && keyword !== term) {
        suggestions.add(keyword);
      }
    }

    // Add title if it matches
    if (page.title.toLowerCase().startsWith(term)) {
      suggestions.add(page.title.toLowerCase());
    }
  }

  return Array.from(suggestions).slice(0, limit);
}

