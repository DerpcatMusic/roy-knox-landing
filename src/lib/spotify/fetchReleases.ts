import { getAccessToken } from "./auth";
import { getSpotifyConfig, SPOTIFY_ARTIST_ID } from "./config";
import type {
  SpotifyAlbum,
  SpotifyAlbumResponse,
  SpotifyAlbumsResponse,
  SpotifyRelease,
} from "./types";

const RELEASE_LIMIT = 8;

function formatReleaseDate(album: SpotifyAlbum): string {
  const { release_date: date, release_date_precision: precision } = album;

  if (precision === "day") {
    const parsed = new Date(`${date}T00:00:00`);
    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (precision === "month") {
    const [year, month] = date.split("-");
    const parsed = new Date(Number(year), Number(month) - 1);
    return parsed.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  return date;
}

function pickArtwork(images: SpotifyAlbum["images"]): string {
  const sorted = [...images].sort((a, b) => b.width - a.width);
  return sorted[0]?.url ?? "";
}

async function spotifyFetch<T>(
  path: string,
  token: string,
): Promise<T | null> {
  const response = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return null;
  return (await response.json()) as T;
}

async function enrichWithLabel(
  album: SpotifyAlbum,
  token: string,
): Promise<string> {
  if (album.label) return album.label;

  const detail = await spotifyFetch<SpotifyAlbumResponse>(
    `/albums/${album.id}`,
    token,
  );

  return detail?.label ?? album.album_type;
}

function dedupeByTitle(albums: SpotifyAlbum[]): SpotifyAlbum[] {
  const seen = new Set<string>();

  return albums.filter((album) => {
    const key = album.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function fetchSpotifyReleases(): Promise<SpotifyRelease[] | null> {
  const config = getSpotifyConfig();
  if (!config) return null;

  try {
    const token = await getAccessToken(config);
    const data = await spotifyFetch<SpotifyAlbumsResponse>(
      `/artists/${SPOTIFY_ARTIST_ID}/albums?include_groups=album,single&limit=50&market=US`,
      token,
    );

    if (!data?.items?.length) return null;

    const sorted = dedupeByTitle(data.items).sort((a, b) => {
      const dateA = new Date(
        a.release_date_precision === "year"
          ? `${a.release_date}-01-01`
          : a.release_date,
      );
      const dateB = new Date(
        b.release_date_precision === "year"
          ? `${b.release_date}-01-01`
          : b.release_date,
      );
      return dateB.getTime() - dateA.getTime();
    });

    const latest = sorted.slice(0, RELEASE_LIMIT);

    return Promise.all(
      latest.map(async (album) => ({
        title: album.name,
        releaseDate: formatReleaseDate(album),
        artworkUrl: pickArtwork(album.images),
        href: album.external_urls.spotify,
        label: await enrichWithLabel(album, token),
      })),
    );
  } catch (error) {
    console.warn("[spotify] Failed to fetch releases:", error);
    return null;
  }
}
