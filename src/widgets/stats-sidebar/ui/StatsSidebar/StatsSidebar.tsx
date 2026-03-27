"use client";

import { getLifeStats, pluralWeeks, pluralYears } from "@/shared/lib/dates";
import glass from "@/shared/styles/glass.module.css";
import styles from "./StatsSidebar.module.css";
import clsx from "clsx";

interface StatsSidebarProps {
  birthDate: string;
}

export function StatsSidebar({ birthDate }: StatsSidebarProps) {
  const stats = getLifeStats(birthDate);

  return (
    <aside className={clsx(glass.card, styles.sidebar)}>
      <h2 className={styles.title}>Статистика</h2>

      <div className={styles.progressWrapper}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${stats.percentLived}%` }}
            role="progressbar"
            aria-valuenow={Math.round(stats.percentLived)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Прожито процентов жизни"
          />
        </div>
        <div className={styles.progressText}>
          <span>Прожито</span>
          <span className={styles.progressPercent}>
            {stats.percentLived.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.statGroup}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Возраст</span>
          <span className={styles.statValue}>
            {pluralYears(stats.ageYears)}, {pluralWeeks(stats.ageWeeks)}
          </span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>Прожито недель</span>
          <span className={styles.statValue}>
            {stats.livedWeeks.toLocaleString("ru-RU")}
          </span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>Осталось недель</span>
          <span className={styles.statValueSecondary}>
            ~{stats.remainingWeeks.toLocaleString("ru-RU")}
          </span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>Всего недель</span>
          <span className={styles.statValueSecondary}>
            {stats.totalWeeks.toLocaleString("ru-RU")}
          </span>
        </div>
      </div>
    </aside>
  );
}
