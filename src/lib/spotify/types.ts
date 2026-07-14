export interface SpotifyRelease {
  title: string;
  releaseDate: string;
  artworkUrl: string;
  href: string;
  label: string;
}

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyAlbum {
  id: string;
  name: string;
  album_type: string;
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  images: SpotifyImage[];
  external_urls: { spotify: string };
  label?: string;
}

export interface SpotifyAlbumsResponse {
  items: SpotifyAlbum[];
}

export interface SpotifyAlbumResponse extends SpotifyAlbum {
  label: string;
}

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
