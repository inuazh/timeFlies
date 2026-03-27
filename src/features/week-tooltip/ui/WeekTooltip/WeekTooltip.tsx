"use client";

import clsx from "clsx";
import type { WeekInfo } from "@/shared/lib/dates";
import styles from "./WeekTooltip.module.css";

interface WeekTooltipProps {
  weekInfo: WeekInfo | null;
  position: { x: number; y: number };
  activeGoals?: Array<{ title: string; color: string }>;
}

const statusLabels: Record<string, { text: string; className: string }> = {
  lived: { text: "Прожита", className: styles.statusLived },
  current: { text: "Текущая неделя", className: styles.statusCurrent },
  future: { text: "Впереди", className: styles.statusFuture },
};

export function WeekTooltip({ weekInfo, position, activeGoals }: WeekTooltipProps) {
  const label = weekInfo ? statusLabels[weekInfo.status] : null;

  return (
    <div
      className={clsx(styles.tooltip, weekInfo && styles.visible)}
      style={{ left: position.x + 12, top: position.y - 10 }}
      role="tooltip"
    >
      {weekInfo && (
        <>
          <div className={styles.yearWeek}>
            Год {weekInfo.year + 1}, Неделя {weekInfo.week + 1}
          </div>
          <div className={styles.dates}>
            {weekInfo.startDate} — {weekInfo.endDate}
          </div>
          {label && (
            <div className={clsx(styles.status, label.className)}>
              {label.text}
            </div>
          )}
          {activeGoals && activeGoals.length > 0 && (
            <div className={styles.goalsSection}>
              {activeGoals.map((g) => (
                <div key={g.title} className={styles.goalItem}>
                  <span
                    className={styles.goalDot}
                    style={{ backgroundColor: g.color }}
                  />
                  <span className={styles.goalTitle}>{g.title}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
