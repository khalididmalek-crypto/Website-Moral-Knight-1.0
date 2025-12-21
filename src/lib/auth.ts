/**
 * Auth utilities (placeholder for toekomstige integraties).
 *
 * Idee:
 * - Hier koppel je later bijv. je identity provider (Azure AD, Keycloak, etc.)
 * - Je bewaart hier GEEN secrets in de code, maar leest ze uit environment vars.
 */

export type UserRole = 'viewer' | 'presenter' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
}

export interface AuthSession {
  user: AuthUser | null;
  /**
   * Unix timestamp (ms) wanneer de sessie verloopt.
   * Handig voor responsible AI: je ziet wanneer iemand toegang had.
   */
  expiresAt?: number;
}

/**
 * Eenvoudige in-memory mock van een ingelogde gebruiker.
 * Vervang dit later door een echte integratie.
 */
let currentSession: AuthSession = {
  user: null,
};

export function getCurrentSession(): AuthSession {
  return currentSession;
}

export function loginAsDemoAdmin(): AuthSession {
  currentSession = {
    user: {
      id: 'demo-admin',
      name: 'Demo Admin',
      email: 'admin@example.com',
      role: 'admin',
    },
    expiresAt: Date.now() + 1000 * 60 * 60, // 1 uur
  };
  return currentSession;
}

export function logout(): void {
  currentSession = { user: null };
}


