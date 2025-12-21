/**
 * Stub voor toekomstige integratie met cloud storage (bijv. Google Drive, SharePoint).
 *
 * In deze lokale demo doen we niets met echte externe storage – dat is een
 * bewust responsible AI-keuze: geen ongecontroleerde data‑exfiltratie.
 * Hier kun je later gecontroleerde, gelogde integraties toevoegen.
 */

export interface RemoteAsset {
  id: string;
  name: string;
  mimeType: string;
  url: string;
  lastModified?: number;
}

export async function listRemoteAssets(): Promise<RemoteAsset[]> {
  // TODO: koppel hier later een echte API aan.
  return [];
}

export async function resolveSharedLink(_url: string): Promise<RemoteAsset | null> {
  // TODO: valideer en normaliseer hier later gedeelde links (Drive, OneDrive, etc.).
  return null;
}


