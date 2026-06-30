import { initialTitrationLabProgress } from "../features/titrationLab/titrationEngine";
import type { LocalProfile, StoredProgress, ThemeMode, TitrationLabProgress } from "../types";
import { createInitialGameState, normalizeGameState } from "./gameRewards";

const LEGACY_PROGRESS_KEY = "chemtrainer-usg-progress-v1";
const LEGACY_TITRATION_LAB_KEY = "chemtrainer-usg-titrationlab-v1";
export const PROFILES_KEY = "chemtrainer:profiles:v1";
export const ACTIVE_PROFILE_KEY = "chemtrainer:activeProfileId:v1";

const PROFILE_COLORS = ["#1f4b99", "#2f7d55", "#c98114", "#bf513b"];
const PROFILE_AVATARS = ["avatar-labcoat", "avatar-molecule", "avatar-burette"];

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function timestamp() {
  return new Date().toISOString();
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function trimName(name: string) {
  const cleaned = name.trim().replace(/\s+/g, " ");
  return cleaned || "Leerling";
}

export function createEmptyProgress(theme: ThemeMode = "light"): StoredProgress {
  return {
    completedLessons: [],
    answers: [],
    mistakes: [],
    theme,
    titrationLab: { ...initialTitrationLabProgress },
  };
}

function normalizeTitrationProgress(input?: Partial<TitrationLabProgress> | null): TitrationLabProgress {
  return { ...initialTitrationLabProgress, ...(input ?? {}) };
}

export function normalizeStoredProgress(input?: Partial<StoredProgress> | null): StoredProgress {
  const base = createEmptyProgress();
  return {
    ...base,
    ...(input ?? {}),
    completedLessons: Array.isArray(input?.completedLessons) ? [...new Set(input.completedLessons)] : [],
    answers: Array.isArray(input?.answers) ? input.answers : [],
    mistakes: Array.isArray(input?.mistakes) ? input.mistakes : [],
    theme: input?.theme === "dark" ? "dark" : "light",
    titrationLab: normalizeTitrationProgress(input?.titrationLab),
  };
}

function pickProfileAvatar(index: number) {
  return PROFILE_AVATARS[index % PROFILE_AVATARS.length];
}

function pickProfileColor(index: number) {
  return PROFILE_COLORS[index % PROFILE_COLORS.length];
}

export function createProfile(name: string, index = 0): LocalProfile {
  const createdAt = timestamp();
  const avatar = pickProfileAvatar(index);
  const baseGame = createInitialGameState();
  return {
    id: uid("profile"),
    name: trimName(name),
    avatar,
    color: pickProfileColor(index),
    createdAt,
    lastActiveAt: createdAt,
    progress: createEmptyProgress(),
    game: {
      ...baseGame,
      unlockedItemIds: [...baseGame.unlockedItemIds, avatar].filter((value, idx, values) => values.indexOf(value) === idx),
      equippedItemIds: [avatar],
    },
  };
}

function normalizeProfile(profile: Partial<LocalProfile> | null | undefined, index: number): LocalProfile {
  const fallback = createProfile(`Leerling ${index + 1}`, index);
  if (!profile) return fallback;
  const avatar = typeof profile.avatar === "string" && profile.avatar ? profile.avatar : fallback.avatar;
  const normalizedGame = normalizeGameState(profile.game);
  const unlockedItemIds = [...new Set([...normalizedGame.unlockedItemIds, avatar])];
  return {
    id: typeof profile.id === "string" && profile.id ? profile.id : fallback.id,
    name: trimName(typeof profile.name === "string" ? profile.name : fallback.name),
    avatar,
    color: typeof profile.color === "string" ? profile.color : fallback.color,
    createdAt: typeof profile.createdAt === "string" ? profile.createdAt : fallback.createdAt,
    lastActiveAt: typeof profile.lastActiveAt === "string" ? profile.lastActiveAt : fallback.lastActiveAt,
    progress: normalizeStoredProgress(profile.progress),
    game: normalizeGameState({
      ...(profile.game ?? {}),
      unlockedItemIds,
      equippedItemIds: normalizedGame.equippedItemIds.includes(avatar)
        ? normalizedGame.equippedItemIds
        : [...normalizedGame.equippedItemIds.filter((itemId) => itemId !== "avatar-labcoat"), avatar],
    }),
  };
}

function buildLegacyProfile(): LocalProfile {
  const legacyProgress = safeParse<Partial<StoredProgress>>(localStorage.getItem(LEGACY_PROGRESS_KEY));
  const legacyTitrationProgress = safeParse<Partial<TitrationLabProgress>>(localStorage.getItem(LEGACY_TITRATION_LAB_KEY));
  const profile = createProfile("Leerling 1");
  return {
    ...profile,
    progress: normalizeStoredProgress({
      ...legacyProgress,
      titrationLab: normalizeTitrationProgress(legacyTitrationProgress),
    }),
  };
}

export function readProfiles(): LocalProfile[] {
  const stored = safeParse<LocalProfile[]>(localStorage.getItem(PROFILES_KEY));
  if (Array.isArray(stored) && stored.length > 0) return stored.map((profile, index) => normalizeProfile(profile, index));
  return [buildLegacyProfile()];
}

export function writeProfiles(profiles: LocalProfile[]) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles.map((profile, index) => normalizeProfile(profile, index))));
}

export function readActiveProfile(profiles = readProfiles()) {
  const storedId = localStorage.getItem(ACTIVE_PROFILE_KEY);
  if (storedId && profiles.some((profile) => profile.id === storedId)) return storedId;
  return profiles[0]?.id ?? createProfile("Leerling 1").id;
}

export function setActiveProfile(profileId: string) {
  localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
}

export function mapActiveProfile(
  profiles: LocalProfile[],
  activeProfileId: string,
  updater: (profile: LocalProfile) => LocalProfile,
) {
  return profiles.map((profile, index) => profile.id === activeProfileId ? normalizeProfile(updater(profile), index) : normalizeProfile(profile, index));
}

export function updateActiveProfileProgress(
  profiles: LocalProfile[],
  activeProfileId: string,
  updater: (progress: StoredProgress) => StoredProgress,
) {
  return mapActiveProfile(profiles, activeProfileId, (profile) => ({
    ...profile,
    lastActiveAt: timestamp(),
    progress: normalizeStoredProgress(updater(profile.progress)),
  }));
}

export function renameProfile(profiles: LocalProfile[], profileId: string, nextName: string) {
  return profiles.map((profile, index) => profile.id === profileId ? normalizeProfile({ ...profile, name: trimName(nextName), lastActiveAt: timestamp() }, index) : normalizeProfile(profile, index));
}

export function deleteProfile(profiles: LocalProfile[], profileId: string, activeProfileId: string) {
  if (profiles.length <= 1) return { profiles, activeProfileId };
  const nextProfiles = profiles.filter((profile) => profile.id !== profileId);
  const nextActiveProfileId = activeProfileId === profileId ? nextProfiles[0].id : activeProfileId;
  return { profiles: nextProfiles.map((profile, index) => normalizeProfile(profile, index)), activeProfileId: nextActiveProfileId };
}

export function resetProfileProgress(profiles: LocalProfile[], profileId: string) {
  return profiles.map((profile, index) => {
    if (profile.id !== profileId) return normalizeProfile(profile, index);
    return normalizeProfile({
      ...profile,
      lastActiveAt: timestamp(),
      progress: createEmptyProgress(profile.progress.theme),
      game: {
        ...createInitialGameState(),
        unlockedItemIds: [...new Set(["avatar-labcoat", profile.avatar])],
        equippedItemIds: [profile.avatar],
      },
    } as Partial<LocalProfile>, index);
  });
}

export function serializeProfilesBackup(profiles: LocalProfile[], activeProfileId: string) {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: timestamp(),
      activeProfileId,
      profiles: profiles.map((profile, index) => normalizeProfile(profile, index)),
    },
    null,
    2,
  );
}

export function parseProfilesBackup(raw: string) {
  const parsed = safeParse<{ activeProfileId?: string; profiles?: LocalProfile[] }>(raw);
  if (!parsed || !Array.isArray(parsed.profiles) || parsed.profiles.length === 0) {
    throw new Error("Dit backupbestand bevat geen geldige profielen.");
  }
  const profiles = parsed.profiles.map((profile, index) => normalizeProfile(profile, index));
  const activeProfileId = profiles.some((profile) => profile.id === parsed.activeProfileId) ? parsed.activeProfileId ?? profiles[0].id : profiles[0].id;
  return { profiles, activeProfileId };
}

export function readProgress(): StoredProgress {
  const profiles = readProfiles();
  const activeProfileId = readActiveProfile(profiles);
  return profiles.find((profile) => profile.id === activeProfileId)?.progress ?? createEmptyProgress();
}

export function writeProgress(progress: StoredProgress) {
  const profiles = updateActiveProfileProgress(readProfiles(), readActiveProfile(), () => progress);
  writeProfiles(profiles);
}

export function readTitrationLabProgress(): TitrationLabProgress {
  return readProgress().titrationLab;
}

export function writeTitrationLabProgress(progress: TitrationLabProgress) {
  writeProgress({ ...readProgress(), titrationLab: normalizeTitrationProgress(progress) });
}
