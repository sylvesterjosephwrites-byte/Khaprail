import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Handles both real `Error`s and Supabase's plain PostgrestError objects, which have a `.message` but aren't `instanceof Error`. */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message
  if (typeof err === "object" && err !== null && "message" in err && typeof err.message === "string") {
    return err.message
  }
  return fallback
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Strips a duplicated trailing file extension (`wall-tiles.png.png` ->
 * `wall-tiles.png`) from a pasted Storage URL. Every image/file URL field in
 * the admin is a plain "paste the URL you got from Supabase Storage" input
 * (no upload widget exists), and that copy-paste step has been producing a
 * doubled extension on every asset (UX_AUDIT_REPORT.md finding 12 / 1.8).
 * Applied where these URLs are saved, not where they're typed, so it can't
 * fight the admin mid-paste. Only strips an exact repeat (`.ext.ext`), so a
 * URL that never had the bug is returned unchanged.
 */
export function stripDuplicatedExtension(url: string): string {
  const match = url.match(/(\.[a-zA-Z0-9]{2,5})\1$/)
  return match ? url.slice(0, -match[1].length) : url
}
