export const SPOTIFY_ARTIST_ID = "6rADW3yvxPKpxWuNUKEed3";

export interface SpotifyConfig {
  clientId: string;
  clientSecret: string;
}

export function getSpotifyConfig(): SpotifyConfig | null {
  const env = import.meta.env ?? {};
  const clientId = env.SPOTIFY_CLIENT_ID;
  const clientSecret = env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) return null;

  return { clientId, clientSecret };
}

export function isSpotifyConfigured(): boolean {
  return getSpotifyConfig() !== null;
}
