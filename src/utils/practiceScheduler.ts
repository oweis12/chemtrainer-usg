import type { ModuleId, Question } from "../types";

export interface PracticeFilter {
  module: ModuleId | "all";
  topic: string;
  skill: string;
  level: number | "all";
}

export type PracticeResultKind = "mastered" | "weak" | "skipped";

export interface PracticeDeck {
  key: string;
  filter: PracticeFilter;
  allQuestionIds: string[];
  unseenQuestionIds: string[];
  seenQuestionIds: string[];
  masteredQuestionIds: string[];
  weakQuestionIds: string[];
  skippedQuestionIds: string[];
  lastQuestionIds: string[];
  currentQuestionId: string | null;
  deckCreatedAt: string;
}

const STORAGE_PREFIX = "chemtrainer-usg-practice-deck-v1:";
const RECENT_LIMIT = 5;

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function unique(items: string[]) {
  return [...new Set(items)];
}

function deckStorageKey(filter: PracticeFilter) {
  return `${STORAGE_PREFIX}${getPracticeDeckKey(filter)}`;
}

export function getPracticeDeckKey(filter: PracticeFilter) {
  return JSON.stringify({
    module: filter.module,
    topic: filter.topic,
    skill: filter.skill,
    level: filter.level,
  });
}

export function buildPracticeDeck(questions: Question[], filter: PracticeFilter): PracticeDeck {
  const allQuestionIds = questions.map((question) => question.id);
  return {
    key: getPracticeDeckKey(filter),
    filter,
    allQuestionIds,
    unseenQuestionIds: shuffle(allQuestionIds),
    seenQuestionIds: [],
    masteredQuestionIds: [],
    weakQuestionIds: [],
    skippedQuestionIds: [],
    lastQuestionIds: [],
    currentQuestionId: null,
    deckCreatedAt: new Date().toISOString(),
  };
}

export function savePracticeDeck(deck: PracticeDeck) {
  localStorage.setItem(deckStorageKey(deck.filter), JSON.stringify(deck));
}

export function loadPracticeDeck(questions: Question[], filter: PracticeFilter) {
  const expectedKey = getPracticeDeckKey(filter);
  try {
    const stored = localStorage.getItem(deckStorageKey(filter));
    if (!stored) return buildPracticeDeck(questions, filter);
    const parsed = JSON.parse(stored) as PracticeDeck;
    const availableIds = new Set(questions.map((question) => question.id));
    if (parsed.key !== expectedKey) return buildPracticeDeck(questions, filter);
    const sanitized: PracticeDeck = {
      ...parsed,
      filter,
      allQuestionIds: questions.map((question) => question.id),
      unseenQuestionIds: parsed.unseenQuestionIds.filter((id) => availableIds.has(id)),
      seenQuestionIds: parsed.seenQuestionIds.filter((id) => availableIds.has(id)),
      masteredQuestionIds: parsed.masteredQuestionIds.filter((id) => availableIds.has(id)),
      weakQuestionIds: parsed.weakQuestionIds.filter((id) => availableIds.has(id)),
      skippedQuestionIds: parsed.skippedQuestionIds.filter((id) => availableIds.has(id)),
      lastQuestionIds: parsed.lastQuestionIds.filter((id) => availableIds.has(id)).slice(-RECENT_LIMIT),
      currentQuestionId: parsed.currentQuestionId && availableIds.has(parsed.currentQuestionId) ? parsed.currentQuestionId : null,
    };
    const known = new Set([...sanitized.unseenQuestionIds, ...sanitized.seenQuestionIds, ...sanitized.masteredQuestionIds, ...sanitized.weakQuestionIds, ...sanitized.skippedQuestionIds, sanitized.currentQuestionId ?? ""]);
    const newIds = sanitized.allQuestionIds.filter((id) => !known.has(id));
    sanitized.unseenQuestionIds = unique([...sanitized.unseenQuestionIds, ...shuffle(newIds)]);
    return sanitized;
  } catch {
    return buildPracticeDeck(questions, filter);
  }
}

export function resetPracticeDeck(filter: PracticeFilter) {
  localStorage.removeItem(deckStorageKey(filter));
}

function chooseCandidate(ids: string[], deck: PracticeDeck) {
  const blocked = new Set([deck.currentQuestionId ?? "", ...deck.lastQuestionIds]);
  return ids.find((id) => !blocked.has(id)) ?? ids.find((id) => id !== deck.currentQuestionId) ?? ids[0] ?? null;
}

function startNewRound(deck: PracticeDeck): PracticeDeck {
  return {
    ...deck,
    unseenQuestionIds: shuffle(deck.allQuestionIds),
    seenQuestionIds: [],
    masteredQuestionIds: [],
    weakQuestionIds: [],
    skippedQuestionIds: [],
    currentQuestionId: null,
    deckCreatedAt: new Date().toISOString(),
  };
}

export function getNextQuestion(deck: PracticeDeck, questions: Question[]) {
  const availableIds = new Set(questions.map((question) => question.id));
  let nextDeck: PracticeDeck = {
    ...deck,
    allQuestionIds: questions.map((question) => question.id),
    unseenQuestionIds: deck.unseenQuestionIds.filter((id) => availableIds.has(id) && !deck.masteredQuestionIds.includes(id)),
    weakQuestionIds: deck.weakQuestionIds.filter((id) => availableIds.has(id) && !deck.masteredQuestionIds.includes(id)),
    skippedQuestionIds: deck.skippedQuestionIds.filter((id) => availableIds.has(id) && !deck.masteredQuestionIds.includes(id)),
  };

  let nextId = chooseCandidate(nextDeck.unseenQuestionIds, nextDeck);
  if (!nextId) nextId = chooseCandidate(nextDeck.skippedQuestionIds, nextDeck);
  if (!nextId) nextId = chooseCandidate(nextDeck.weakQuestionIds, nextDeck);
  if (!nextId && nextDeck.allQuestionIds.length) {
    nextDeck = startNewRound(nextDeck);
    nextId = chooseCandidate(nextDeck.unseenQuestionIds, nextDeck);
  }

  if (!nextId) return { deck: nextDeck, question: null as Question | null };

  nextDeck = {
    ...nextDeck,
    currentQuestionId: nextId,
    unseenQuestionIds: nextDeck.unseenQuestionIds.filter((id) => id !== nextId),
    skippedQuestionIds: nextDeck.skippedQuestionIds.filter((id) => id !== nextId),
    seenQuestionIds: unique([...nextDeck.seenQuestionIds, nextId]),
  };
  savePracticeDeck(nextDeck);
  return { deck: nextDeck, question: questions.find((question) => question.id === nextId) ?? null };
}

export function markQuestionResult(deck: PracticeDeck, questionId: string, result: PracticeResultKind | boolean) {
  const normalized: PracticeResultKind = typeof result === "boolean" ? result ? "mastered" : "weak" : result;
  const recent = unique([...deck.lastQuestionIds.filter((id) => id !== questionId), questionId]).slice(-RECENT_LIMIT);
  const removeFrom = (items: string[]) => items.filter((id) => id !== questionId);
  const next: PracticeDeck = {
    ...deck,
    currentQuestionId: deck.currentQuestionId === questionId ? null : deck.currentQuestionId,
    unseenQuestionIds: removeFrom(deck.unseenQuestionIds),
    seenQuestionIds: unique([...deck.seenQuestionIds, questionId]),
    masteredQuestionIds: normalized === "mastered" ? unique([...deck.masteredQuestionIds, questionId]) : removeFrom(deck.masteredQuestionIds),
    weakQuestionIds: normalized === "weak" ? unique([...removeFrom(deck.weakQuestionIds), questionId]) : removeFrom(deck.weakQuestionIds),
    skippedQuestionIds: normalized === "skipped" ? unique([...removeFrom(deck.skippedQuestionIds), questionId]) : removeFrom(deck.skippedQuestionIds),
    lastQuestionIds: recent,
  };
  savePracticeDeck(next);
  return next;
}
