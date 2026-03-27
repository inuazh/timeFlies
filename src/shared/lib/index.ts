export { db } from "./db";
export {
  createToken,
  verifyToken,
  AUTH_COOKIE_NAME,
  COOKIE_OPTIONS,
} from "./auth";
export {
  getLifeStats,
  getWeekInfo,
  formatDate,
  pluralWeeks,
  pluralYears,
  LIFE_EXPECTANCY_YEARS,
  WEEKS_PER_YEAR,
  TOTAL_WEEKS,
} from "./dates";
export type { WeekStatus, LifeStats, WeekInfo } from "./dates";
