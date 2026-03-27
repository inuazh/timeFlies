export const LIFE_EXPECTANCY_YEARS = 75;
export const WEEKS_PER_YEAR = 52;
export const TOTAL_WEEKS = LIFE_EXPECTANCY_YEARS * WEEKS_PER_YEAR;

export type WeekStatus = "lived" | "current" | "future";

export interface LifeStats {
  totalWeeks: number;
  livedWeeks: number;
  remainingWeeks: number;
  currentYearIndex: number;
  currentWeekIndex: number;
  percentLived: number;
  ageYears: number;
  ageWeeks: number;
}

export interface WeekInfo {
  year: number;
  week: number;
  status: WeekStatus;
  startDate: string;
  endDate: string;
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function weeksBetween(start: Date, end: Date): number {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor((end.getTime() - start.getTime()) / msPerWeek);
}

export function getLifeStats(birthDateStr: string): LifeStats {
  const birthDate = new Date(birthDateStr);
  const birthMonday = getMonday(birthDate);
  const now = new Date();
  const currentMonday = getMonday(now);

  const livedWeeks = Math.max(0, weeksBetween(birthMonday, currentMonday));
  const remainingWeeks = Math.max(0, TOTAL_WEEKS - livedWeeks);
  const currentYearIndex = Math.floor(livedWeeks / WEEKS_PER_YEAR);
  const currentWeekIndex = livedWeeks % WEEKS_PER_YEAR;
  const percentLived = Math.min(100, (livedWeeks / TOTAL_WEEKS) * 100);

  const ageYears = Math.floor(livedWeeks / WEEKS_PER_YEAR);
  const ageWeeks = livedWeeks % WEEKS_PER_YEAR;

  return {
    totalWeeks: TOTAL_WEEKS,
    livedWeeks,
    remainingWeeks,
    currentYearIndex,
    currentWeekIndex,
    percentLived,
    ageYears,
    ageWeeks,
  };
}

export function getWeekInfo(
  birthDateStr: string,
  yearIndex: number,
  weekIndex: number
): WeekInfo {
  const birthDate = new Date(birthDateStr);
  const birthMonday = getMonday(birthDate);
  const weekNumber = yearIndex * WEEKS_PER_YEAR + weekIndex;

  const startDate = addDays(birthMonday, weekNumber * 7);
  const endDate = addDays(startDate, 6);

  const now = new Date();
  const currentMonday = getMonday(now);
  const livedWeeks = weeksBetween(birthMonday, currentMonday);

  let status: WeekStatus;
  if (weekNumber < livedWeeks) {
    status = "lived";
  } else if (weekNumber === livedWeeks) {
    status = "current";
  } else {
    status = "future";
  }

  return {
    year: yearIndex,
    week: weekIndex,
    status,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function pluralWeeks(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} неделя`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return `${n} недели`;
  return `${n} недель`;
}

export function pluralYears(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} год`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return `${n} года`;
  return `${n} лет`;
}
