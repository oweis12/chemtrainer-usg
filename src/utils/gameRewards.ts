import { lessons } from "../data/lessons";
import { shopItemMap } from "../data/shopItems";
import type { GameEvent, GameState, LocalProfile, Question, ShopItem } from "../types";

type RewardActionType = GameEvent["type"];

export interface RewardGrant {
  id: string;
  type: RewardActionType;
  label: string;
  points: number;
  xp: number;
}

export interface RewardResolution {
  profile: LocalProfile;
  grants: RewardGrant[];
}

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1850, 2550, 3400];
const QUESTION_REWARD_POINTS: Record<Question["level"], number> = {
  1: 5,
  2: 8,
  3: 12,
  4: 16,
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function localDateStamp(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function previousDateStamp(stamp: string) {
  const date = new Date(`${stamp}T12:00:00`);
  date.setDate(date.getDate() - 1);
  return localDateStamp(date);
}

function touchProfile(profile: LocalProfile) {
  return { ...profile, lastActiveAt: new Date().toISOString() };
}

function createGrant(type: RewardActionType, label: string, points: number, xp = points): RewardGrant {
  return { id: makeId(type), type, label, points, xp };
}

function appendEvent(game: GameState, grant: RewardGrant): GameState {
  const event: GameEvent = {
    id: grant.id,
    type: grant.type,
    points: grant.points,
    createdAt: new Date().toISOString(),
    label: grant.label,
  };
  const nextXp = Math.max(0, game.xp + grant.xp);
  return {
    ...game,
    points: Math.max(0, game.points + grant.points),
    lifetimePoints: game.lifetimePoints + Math.max(0, grant.points),
    xp: nextXp,
    level: calculateLevel(nextXp),
    eventLog: [event, ...game.eventLog].slice(0, 40),
  };
}

function applyGrants(game: GameState, grants: RewardGrant[]) {
  return grants.reduce((current, grant) => appendEvent(current, grant), game);
}

function hasCompletedModule(profile: LocalProfile, moduleId: Question["module"]) {
  const lessonIds = lessons.filter((lesson) => lesson.module === moduleId).map((lesson) => lesson.id);
  return lessonIds.length > 0 && lessonIds.every((lessonId) => profile.progress.completedLessons.includes(lessonId));
}

function isTitrationQuestion(question: Question) {
  return question.module === "M10" && /titr|buret|indicator|equivalentie|molariteit|zuur-base|azijn/i.test(`${question.topic} ${question.question}`);
}

function withAchievement(profile: LocalProfile, id: string, label: string, points: number) {
  if (profile.game.achievements.includes(id)) return { profile, grants: [] as RewardGrant[] };
  const grants = [createGrant("achievement", label, points, points)];
  return {
    profile: {
      ...profile,
      game: applyGrants({ ...profile.game, achievements: [...profile.game.achievements, id] }, grants),
    },
    grants,
  };
}

function unlockAchievementBatch(profile: LocalProfile) {
  let next = profile;
  const grants: RewardGrant[] = [];
  const correctCount = next.progress.answers.filter((answer) => answer.correct).length;

  if (next.progress.completedLessons.length >= 1 && !next.game.achievements.includes("first-lesson")) {
    const resolution = withAchievement(next, "first-lesson", "Achievement: eerste les afgerond", 20);
    next = resolution.profile;
    grants.push(...resolution.grants);
  }

  if (correctCount >= 10 && !next.game.achievements.includes("ten-correct")) {
    const resolution = withAchievement(next, "ten-correct", "Achievement: 10 vragen goed", 30);
    next = resolution.profile;
    grants.push(...resolution.grants);
  }

  if (correctCount >= 25 && !next.game.achievements.includes("twentyfive-correct")) {
    const resolution = withAchievement(next, "twentyfive-correct", "Achievement: 25 vragen goed", 60);
    next = resolution.profile;
    grants.push(...resolution.grants);
  }

  if (next.game.streakDays >= 5 && !next.game.achievements.includes("streak-5")) {
    const resolution = withAchievement(next, "streak-5", "Achievement: 5-daagse leerstreak", 50);
    next = resolution.profile;
    grants.push(...resolution.grants);
  }

  (["M4", "M5D", "M6", "M7", "M8", "M9", "M10"] as Array<Question["module"]>).forEach((moduleId) => {
    const achievementId = `module-complete-${moduleId}`;
    if (hasCompletedModule(next, moduleId) && !next.game.achievements.includes(achievementId)) {
      const resolution = withAchievement(next, achievementId, `Achievement: alle lessen van ${moduleId} afgerond`, 100);
      next = resolution.profile;
      grants.push(...resolution.grants);
    }
  });

  return { profile: next, grants };
}

function normalizeUnlockedItems(unlockedItemIds: string[]) {
  const defaults = ["avatar-labcoat"];
  return [...new Set([...defaults, ...unlockedItemIds.filter((itemId) => Boolean(shopItemMap[itemId]))])];
}

function normalizeEquippedItems(unlockedItemIds: string[], equippedItemIds: string[]) {
  const unlockedSet = new Set(unlockedItemIds);
  const slotMap = new Map<ShopItem["cosmeticSlot"], string>();
  equippedItemIds.forEach((itemId) => {
    const item = shopItemMap[itemId];
    if (!item || !unlockedSet.has(itemId)) return;
    slotMap.set(item.cosmeticSlot, itemId);
  });
  if (!slotMap.has("avatar")) slotMap.set("avatar", "avatar-labcoat");
  return [...slotMap.values()];
}

export function calculateLevel(xp: number) {
  let level = 1;
  for (let index = 1; index < LEVEL_THRESHOLDS.length; index += 1) {
    if (xp >= LEVEL_THRESHOLDS[index]) level = index + 1;
  }
  if (xp < LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]) return level;
  return LEVEL_THRESHOLDS.length + Math.floor((xp - LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]) / 900);
}

export function createInitialGameState(): GameState {
  return {
    points: 0,
    lifetimePoints: 0,
    level: 1,
    xp: 0,
    streakDays: 0,
    lastActiveDate: undefined,
    unlockedItemIds: ["avatar-labcoat"],
    equippedItemIds: ["avatar-labcoat"],
    achievements: [],
    eventLog: [],
    rewardedLessonIds: [],
    questionRewardLedger: {},
    companionHidden: false,
  };
}

export function normalizeGameState(input?: Partial<GameState> | null): GameState {
  const base = createInitialGameState();
  const merged = { ...base, ...(input ?? {}) };
  const unlockedItemIds = normalizeUnlockedItems(Array.isArray(merged.unlockedItemIds) ? merged.unlockedItemIds : []);
  const equippedItemIds = normalizeEquippedItems(unlockedItemIds, Array.isArray(merged.equippedItemIds) ? merged.equippedItemIds : []);
  const xp = Number.isFinite(merged.xp) ? merged.xp : 0;
  return {
    ...merged,
    points: Number.isFinite(merged.points) ? Math.max(0, merged.points) : 0,
    lifetimePoints: Number.isFinite(merged.lifetimePoints) ? Math.max(0, merged.lifetimePoints) : 0,
    xp,
    level: calculateLevel(xp),
    streakDays: Number.isFinite(merged.streakDays) ? Math.max(0, merged.streakDays) : 0,
    unlockedItemIds,
    equippedItemIds,
    achievements: Array.isArray(merged.achievements) ? [...new Set(merged.achievements)] : [],
    eventLog: Array.isArray(merged.eventLog) ? merged.eventLog.slice(0, 40) : [],
    rewardedLessonIds: Array.isArray(merged.rewardedLessonIds) ? [...new Set(merged.rewardedLessonIds)] : [],
    questionRewardLedger: merged.questionRewardLedger && typeof merged.questionRewardLedger === "object" ? merged.questionRewardLedger : {},
    companionHidden: Boolean(merged.companionHidden),
  };
}

export function applyDailyStreakReward(profile: LocalProfile): RewardResolution {
  const today = localDateStamp();
  if (profile.game.lastActiveDate === today) return { profile, grants: [] };
  const streakDays = profile.game.lastActiveDate === previousDateStamp(today) ? profile.game.streakDays + 1 : 1;
  const grants = [createGrant("streak", `Streakdag ${streakDays}: actief geleerd`, 10, 10)];
  let next: LocalProfile = {
    ...touchProfile(profile),
    game: applyGrants({ ...profile.game, streakDays, lastActiveDate: today }, grants),
  };
  const achievements = unlockAchievementBatch(next);
  next = achievements.profile;
  return { profile: next, grants: [...grants, ...achievements.grants] };
}

export function completeLessonWithRewards(profile: LocalProfile, lessonId: string): RewardResolution {
  if (profile.progress.completedLessons.includes(lessonId)) return { profile, grants: [] };
  const completedLessons = [...profile.progress.completedLessons, lessonId];
  const lessonGrant = createGrant("lesson_completed", "Les voor het eerst afgerond", 25, 25);
  let next: LocalProfile = {
    ...touchProfile(profile),
    progress: { ...profile.progress, completedLessons },
    game: applyGrants(
      {
        ...profile.game,
        rewardedLessonIds: [...new Set([...profile.game.rewardedLessonIds, lessonId])],
      },
      [lessonGrant],
    ),
  };
  const achievements = unlockAchievementBatch(next);
  next = achievements.profile;
  return { profile: next, grants: [lessonGrant, ...achievements.grants] };
}

export function recordQuestionResultWithRewards(
  profile: LocalProfile,
  question: Question,
  correct: boolean,
  reflection: string,
  source: "practice" | "test" = "practice",
): RewardResolution {
  const now = new Date().toISOString();
  const answer = {
    questionId: question.id,
    correct,
    answeredAt: now,
    module: question.module,
    topic: question.topic,
    level: question.level,
  };
  const mistakes = correct
    ? profile.progress.mistakes
    : [
      ...profile.progress.mistakes,
      {
        id: `${question.id}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        questionId: question.id,
        module: question.module,
        topic: question.topic,
        faultType: question.skill,
        createdAt: now,
        reflection,
      },
    ];

  let next: LocalProfile = touchProfile({
    ...profile,
    progress: {
      ...profile.progress,
      answers: [...profile.progress.answers, answer],
      mistakes,
    },
  });

  const grants: RewardGrant[] = [];
  if (correct) {
    const today = localDateStamp();
    const ledgerEntry = next.game.questionRewardLedger[question.id];
    const todayCount = ledgerEntry?.date === today ? ledgerEntry.rewardedCount : 0;
    if (todayCount < 2) {
      const basePoints = QUESTION_REWARD_POINTS[question.level] ?? 5;
      const bonus = source === "test" ? 5 : 0;
      grants.push(createGrant("question_correct", bonus ? `Vraag goed beantwoord (+${bonus} toetsbonus)` : "Vraag goed beantwoord", basePoints + bonus, basePoints + bonus));
      next = {
        ...next,
        game: {
          ...next.game,
          questionRewardLedger: {
            ...next.game.questionRewardLedger,
            [question.id]: { date: today, rewardedCount: todayCount + 1 },
          },
        },
      };
    }
    if (isTitrationQuestion(question) && !next.game.achievements.includes("first-titration-correct")) {
      const resolution = withAchievement(next, "first-titration-correct", "Achievement: eerste titratievraag goed", 40);
      next = resolution.profile;
      grants.push(...resolution.grants);
    }
  } else if (reflection.trim().length >= 16) {
    next = {
      ...next,
      game: {
        ...next.game,
        xp: next.game.xp + 2,
        level: calculateLevel(next.game.xp + 2),
      },
    };
  }

  if (grants.length > 0) {
    next = { ...next, game: applyGrants(next.game, grants.filter((grant) => grant.type !== "achievement")) };
  }

  const achievements = unlockAchievementBatch(next);
  next = achievements.profile;
  const achievementGrants = achievements.grants.filter((grant) => !grants.some((existing) => existing.id === grant.id));
  return { profile: next, grants: [...grants, ...achievementGrants] };
}

export function purchaseShopItem(profile: LocalProfile, itemId: string): RewardResolution {
  const item = shopItemMap[itemId];
  if (!item || profile.game.unlockedItemIds.includes(itemId) || profile.game.points < item.price) return { profile, grants: [] };
  const purchaseGrant = createGrant("purchase", `Shop: ${item.name} gekocht`, -item.price, 0);
  return {
    profile: {
      ...touchProfile(profile),
      game: applyGrants(
        {
          ...profile.game,
          unlockedItemIds: [...profile.game.unlockedItemIds, itemId],
        },
        [purchaseGrant],
      ),
    },
    grants: [purchaseGrant],
  };
}

export function toggleEquippedItem(profile: LocalProfile, itemId: string): LocalProfile {
  const item = shopItemMap[itemId];
  if (!item || !profile.game.unlockedItemIds.includes(itemId)) return profile;
  const equipped = new Set(profile.game.equippedItemIds);
  const sameSlotIds = profile.game.equippedItemIds.filter((equippedItemId) => shopItemMap[equippedItemId]?.cosmeticSlot === item.cosmeticSlot);
  sameSlotIds.forEach((equippedItemId) => equipped.delete(equippedItemId));
  if (!profile.game.equippedItemIds.includes(itemId)) equipped.add(itemId);
  if (![...equipped].some((equippedItemId) => shopItemMap[equippedItemId]?.cosmeticSlot === "avatar")) {
    equipped.add("avatar-labcoat");
  }
  return {
    ...touchProfile(profile),
    game: {
      ...profile.game,
      equippedItemIds: normalizeEquippedItems(profile.game.unlockedItemIds, [...equipped]),
    },
  };
}

export function setCompanionHidden(profile: LocalProfile, companionHidden: boolean): LocalProfile {
  return {
    ...touchProfile(profile),
    game: {
      ...profile.game,
      companionHidden,
    },
  };
}
