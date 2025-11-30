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
      "dashboard", "overview", "kpi", "nodes", "alerts", "water level", "hotspot map",
      "time series", "analysis", "recent activity", "flood", "total nodes", "active",
      "riskiest area", "average", "telemetry", "monthly", "state", "critical", "warning",
      "live", "situational", "sarawak", "sensor", "sensors",
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
      "sensors", "sensor", "iot", "devices", "nodes", "water level", "status", "active",
      "inactive", "area", "state", "timestamp", "last update", "add sensor", "delete",
      "search", "filter", "sort", "table", "telemetry", "coordinates", "longitude",
      "latitude", "safe", "warning", "danger", "monitor", "device",
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
      "map", "flood map", "google maps", "location", "markers", "sensors", "sensor",
      "coordinates", "latitude", "longitude", "hotspot", "area", "region", "sarawak",
      "kuching", "interactive", "zoom", "status", "legend", "active nodes", "inactive",
      "geolocation", "geography",
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
      "analytics", "charts", "graphs", "statistics", "data", "trends", "water level",
      "monthly", "weekly", "daily", "area chart", "bar chart", "pie chart", "scatter plot",
      "distribution", "high risk", "states", "mongodb", "schema", "recommendations",
      "insights", "forecast", "prediction", "analysis", "report", "sensor", "sensors",
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
      "alerts", "alert", "notifications", "warning", "danger", "critical", "safe",
      "monitoring", "real-time", "today", "yesterday", "last week", "filter", "latest",
      "recent", "inactive node", "new nodes", "water level", "threshold", "exceeded",
      "rising", "falling", "emergency", "status change", "sensor", "sensors",
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
      "roles", "role", "users", "user", "permissions", "access control", "admin",
      "operations manager", "field technician", "viewer", "add role", "add user",
      "delete", "remove", "manage", "full access", "view dashboard", "manage sensors",
      "manage alerts", "active", "inactive", "last active", "email", "team", "member",
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
      "admin", "settings", "account", "profile", "name", "email", "phone", "department",
      "notifications", "push notifications", "email alerts", "sms alerts", "security",
      "password", "two-factor", "2fa", "sessions", "activity", "preferences", "save",
      "reset", "personal", "administrator",
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
      "settings", "crm", "configuration", "general", "notifications", "data management",
      "integrations", "security", "appearance", "theme", "dark mode", "light mode",
      "map settings", "backup", "restore", "export", "import", "api", "webhook",
      "timezone", "language", "retention", "cleanup", "system", "configure",
    ],
  },
];

// Get all pages (for showing when search is focused but empty)
export function getAllPages(): SearchResult[] {
  return searchIndex;
}

// Search function that matches query against keywords
export function searchPages(query: string): SearchResult[] {
  const trimmedQuery = query.toLowerCase().trim();
  
  // If no query, return empty (caller should use getAllPages() for initial display)
  if (!trimmedQuery) {
    return [];
  }

  const searchTerms = trimmedQuery.split(/\s+/);

  // Score each page based on keyword matches
  const scoredResults = searchIndex.map((page) => {
    let score = 0;
    const titleLower = page.title.toLowerCase();
    const descLower = page.description.toLowerCase();

    for (const term of searchTerms) {
      // Exact title match - highest priority
      if (titleLower === term) {
        score += 100;
      }
      // Title starts with term
      else if (titleLower.startsWith(term)) {
        score += 80;
      }
      // Title contains term
      else if (titleLower.includes(term)) {
        score += 60;
      }
      
      // Description contains term
      if (descLower.includes(term)) {
        score += 30;
      }
      
      // Keyword exact match
      for (const keyword of page.keywords) {
        if (keyword === term) {
          score += 25;
          break;
        } else if (keyword.startsWith(term)) {
          score += 15;
          break;
        } else if (keyword.includes(term)) {
          score += 10;
          break;
        }
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

// Highlight matching text in a string
export function highlightMatch(text: string, query: string): { text: string; isMatch: boolean }[] {
  if (!query.trim()) {
    return [{ text, isMatch: false }];
  }

  const parts: { text: string; isMatch: boolean }[] = [];
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  
  let lastIndex = 0;
  let index = lowerText.indexOf(lowerQuery);
  
  while (index !== -1) {
    // Add non-matching part before the match
    if (index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, index), isMatch: false });
    }
    // Add matching part
    parts.push({ text: text.slice(index, index + lowerQuery.length), isMatch: true });
    lastIndex = index + lowerQuery.length;
    index = lowerText.indexOf(lowerQuery, lastIndex);
  }
  
  // Add remaining non-matching part
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), isMatch: false });
  }
  
  return parts.length > 0 ? parts : [{ text, isMatch: false }];
}
