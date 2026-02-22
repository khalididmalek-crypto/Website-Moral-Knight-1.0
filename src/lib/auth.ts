/**
 * Auth utilities (placeholder for toekomstige integraties).
 * 
 * EXTREME SECURITY STANDARDS (Mandatory for Admin):
 * 1. Multi-Factor Authentication (MFA): Alleen toegang tot admin-functies na 2FA verificatie.
 * 2. Wachtwoordbeleid: Minimaal 16 tekens, inclusief symbolen, hoofdletters en cijfers.
 * 3. Session Hardening: Sessies verlopen na 30 minuten inactiviteit.
 * 4. Audit Log: Elke inlogpoging en administratieve actie wordt gelogd (zonder PII).
 *
 * Idee:
 * - Hier koppel je later bijv. je identity provider (Azure AD, Keycloak, etc.)
 */

export type UserRole = 'viewer' | 'presenter' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  mfaVerified?: boolean; // Verplicht voor admin acties
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


