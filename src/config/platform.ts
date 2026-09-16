/**
 * Platform configuration layer.
 *
 * Languages and content verticals live here so no reusable component ever
 * hardcodes Bhojpuri-specific logic. Adding a language = adding an entry.
 */

export type LanguageCode = "bho" | "hi" | "bh-mag" | "raj";

export interface LanguageConfig {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  enabled: boolean;
}

export const LANGUAGES: LanguageConfig[] = [
  { code: "bho", label: "Bhojpuri", nativeLabel: "भोजपुरी", enabled: true },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", enabled: false },
  { code: "bh-mag", label: "Magahi", nativeLabel: "मगही", enabled: false },
  { code: "raj", label: "Rajasthani", nativeLabel: "राजस्थानी", enabled: false },
];

export const DEFAULT_LANGUAGE: LanguageCode = "bho";

export const enabledLanguages = () => LANGUAGES.filter((l) => l.enabled);

export const languageLabel = (code: LanguageCode) =>
  LANGUAGES.find((l) => l.code === code)?.label ?? code;

export const languageNativeLabel = (code: LanguageCode) =>
  LANGUAGES.find((l) => l.code === code)?.nativeLabel ?? code;

/** Content verticals — configuration, not component logic. */
export interface ContentVertical {
  slug: string;
  label: string;
  emoji: string;
  mature: boolean;
}

export const CONTENT_VERTICALS: ContentVertical[] = [
  { slug: "songs", label: "Songs", emoji: "🎵", mature: false },
  { slug: "comedy", label: "Comedy", emoji: "😂", mature: false },
  { slug: "movies", label: "Movies", emoji: "🎬", mature: false },
  { slug: "shorts", label: "Shorts", emoji: "⚡", mature: false },
  { slug: "entertainment", label: "Entertainment", emoji: "🎪", mature: false },
  { slug: "culture", label: "Culture", emoji: "🪔", mature: false },
  { slug: "interviews", label: "Interviews", emoji: "🎙️", mature: false },
  { slug: "news", label: "News", emoji: "📰", mature: false },
  { slug: "lifestyle", label: "Lifestyle", emoji: "🌿", mature: false },
  { slug: "mature", label: "18+ Mature", emoji: "🔞", mature: true },
];

export const verticalLabel = (slug: string) =>
  CONTENT_VERTICALS.find((v) => v.slug === slug)?.label ?? slug;

export const APP = {
  name: "Echo Reels",
  adminName: "Echo Reels Admin",
  tagline: "2-Minute Micro-Drama OTT",
};
