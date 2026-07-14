import { fetchSpotifyReleases } from "./fetchReleases";
import { fetchMusicBrainzReleases } from "../musicbrainz/fetchReleases";
import type { SpotifyRelease } from "./types";

export async function getReleases(): Promise<{
  releases: SpotifyRelease[];
  source: "spotify" | "musicbrainz" | "unavailable";
}> {
  const live = await fetchSpotifyReleases();

  if (live?.length) {
    return { releases: live, source: "spotify" };
  }

  const publicReleases = await fetchMusicBrainzReleases();

  if (publicReleases?.length) {
    return { releases: publicReleases, source: "musicbrainz" };
  }

  return { releases: [], source: "unavailable" };
}
