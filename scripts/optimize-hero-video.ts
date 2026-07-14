/**
 * Hero video optimizer — Bun orchestrates ffmpeg (no native Bun video codec yet).
 *
 * Usage:
 *   bun run scripts/optimize-hero-video.ts [source.mp4]
 *
 * Defaults to the Roy Knox burning piano loop in ~/Downloads.
 */
import { mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = join(ROOT, "public", "video");

const DEFAULT_SOURCE =
  "/home/derpcat/Downloads/RoyKnox_BurningPiano_Loop_249f_2560x1440_h265_29092025.mp4";

const source = resolve(process.argv[2] ?? DEFAULT_SOURCE);

type FfmpegResult = { ok: boolean; stderr: string };

async function runFfmpeg(args: string[], label: string): Promise<FfmpegResult> {
  console.log(`\n→ ${label}`);
  console.log(`  ffmpeg ${args.join(" ")}`);

  const proc = Bun.spawn(["ffmpeg", "-hide_banner", "-y", ...args], {
    stdout: "inherit",
    stderr: "pipe",
  });

  const stderr = await new Response(proc.stderr).text();
  const ok = (await proc.exited) === 0;

  if (!ok) {
    console.error(stderr);
    throw new Error(`ffmpeg failed: ${label}`);
  }

  return { ok, stderr };
}

async function fileSize(path: string): Promise<string> {
  const file = Bun.file(path);
  const bytes = file.size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function main() {
  const sourceFile = Bun.file(source);
  if (!(await sourceFile.exists())) {
    console.error(`Source not found: ${source}`);
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });

  console.log(`Source: ${source} (${await fileSize(source)})`);
  console.log(`Output: ${OUT_DIR}`);

  const scale = "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2";

  // WebM VP9 — primary format for Chromium/Firefox
  await runFfmpeg(
    [
      "-i",
      source,
      "-an",
      "-vf",
      scale,
      "-c:v",
      "libvpx-vp9",
      "-crf",
      "32",
      "-b:v",
      "0",
      "-row-mt",
      "1",
      "-threads",
      "0",
      join(OUT_DIR, "hero-burning-piano.webm"),
    ],
    "WebM VP9 (1920×1080)",
  );

  // MP4 H.264 — Safari / legacy fallback
  await runFfmpeg(
    [
      "-i",
      source,
      "-an",
      "-vf",
      scale,
      "-c:v",
      "libx264",
      "-crf",
      "26",
      "-preset",
      "slow",
      "-movflags",
      "+faststart",
      "-pix_fmt",
      "yuv420p",
      join(OUT_DIR, "hero-burning-piano.mp4"),
    ],
    "MP4 H.264 (1920×1080)",
  );

  // Poster frame — mid-loop still for LCP / reduced-motion fallback
  await runFfmpeg(
    [
      "-ss",
      "2",
      "-i",
      source,
      "-vframes",
      "1",
      "-vf",
      scale,
      "-c:v",
      "libwebp",
      "-quality",
      "82",
      join(OUT_DIR, "hero-burning-piano-poster.webp"),
    ],
    "Poster WebP",
  );

  console.log("\n── Output sizes ──");
  for (const name of [
    "hero-burning-piano.webm",
    "hero-burning-piano.mp4",
    "hero-burning-piano-poster.webp",
  ]) {
    const path = join(OUT_DIR, name);
    console.log(`  ${name}: ${await fileSize(path)}`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
