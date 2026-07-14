import type { SpotifyRelease } from "../spotify/types";

const MUSICBRAINZ_ARTIST_ID = "4a35ef57-b770-43ec-b6e7-52d808548f49";
const RELEASE_LIMIT = 6;
const USER_AGENT = "royknox-flare/0.1 (https://royknoxmusic.com)";

interface MusicBrainzRelease {
  id: string;
  title: string;
  date?: string;
  "label-info"?: Array<{
    label?: {
      name?: string;
    };
  }>;
  "cover-art-archive"?: {
    front?: boolean;
    artwork?: boolean;
  };
}

interface MusicBrainzReleaseResponse {
  releases?: MusicBrainzRelease[];
}

function parseDate(date?: string): number {
  if (!date) return 0;
  if (/^\d{4}$/.test(date)) return new Date(`${date}-01-01T00:00:00`).getTime();
  if (/^\d{4}-\d{2}$/.test(date)) return new Date(`${date}-01T00:00:00`).getTime();
  return new Date(`${date}T00:00:00`).getTime();
}

function formatDate(date?: string): string {
  if (!date) return "Date TBA";

  if (/^\d{4}$/.test(date)) return date;

  const parsed = new Date(
    /^\d{4}-\d{2}$/.test(date) ? `${date}-01T00:00:00` : `${date}T00:00:00`,
  );

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    ...(date.length > 7 ? { day: "numeric" as const } : {}),
    year: "numeric",
  });
}

function artworkUrl(release: MusicBrainzRelease): string {
  if (!release["cover-art-archive"]?.front) return "";
  return `https://coverartarchive.org/release/${release.id}/front-500`;
}

function labelFor(release: MusicBrainzRelease): string {
  return release["label-info"]?.find((entry) => entry.label?.name)?.label?.name ?? "Release";
}

export async function fetchMusicBrainzReleases(): Promise<SpotifyRelease[] | null> {
  const params = new URLSearchParams({
    artist: MUSICBRAINZ_ARTIST_ID,
    type: "album|single",
    fmt: "json",
    limit: "100",
    inc: "release-groups+labels",
  });

  try {
    const response = await fetch(`https://musicbrainz.org/ws/2/release?${params}`, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as MusicBrainzReleaseResponse;
    if (!data.releases?.length) return null;

    return data.releases
      .filter((release) => release.date)
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))
      .slice(0, RELEASE_LIMIT)
      .map((release) => ({
        title: release.title,
        releaseDate: formatDate(release.date),
        artworkUrl: artworkUrl(release),
        href: "https://musicbrainz.org/release/" + release.id,
        label: labelFor(release),
      }));
  } catch (error) {
    console.warn("[musicbrainz] Failed to fetch releases:", error);
    return null;
  }
}
