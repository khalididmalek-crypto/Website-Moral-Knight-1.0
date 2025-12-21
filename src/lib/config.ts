/**
 * Centrale configuratie voor de app.
 *
 * Hier kun je later environment-specifieke settings kwijt,
 * bijvoorbeeld API‑endpoints, feature flags of toggles voor
 * Responsible-AI functionaliteit.
 */

export interface ResponsibleAiConfig {
  /**
   * Toon altijd duidelijk dat de gebruiker met een AI-systeem werkt.
   */
  showAiDisclosure: boolean;

  /**
   * Toon uitleg bij elke tegel over de bedoeling / context.
   */
  showContextExplainers: boolean;

  /**
   * Staat logging van interacties aan? (alleen mits juridisch toegestaan).
   * In deze lokale demo standaard uit.
   */
  enableLocalLogging: boolean;
}

export interface AppConfig {
  appName: string;
  organisation: string;
  defaultLanguage: 'nl' | 'en';
  responsibleAi: ResponsibleAiConfig;
}

export const CONFIG: AppConfig = {
  appName: 'Moral Knight Overhead',
  organisation: 'Moral Knight',
  defaultLanguage: 'nl',
  responsibleAi: {
    showAiDisclosure: true,
    showContextExplainers: true,
    enableLocalLogging: false,
  },
};


