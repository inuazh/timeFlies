"use client";

import clsx from "clsx";
import type { WeekStatus } from "../../model/types";
import styles from "./WeekCell.module.css";

interface WeekCellProps {
  yearIndex: number;
  weekIndex: number;
  status: WeekStatus;
  goalColors?: string[];
  isGoalTarget?: boolean;
  goalTargetColor?: string;
  onMouseEnter: (e: React.MouseEvent, yearIndex: number, weekIndex: number) => void;
  onMouseLeave: () => void;
  onClick?: (e: React.MouseEvent, yearIndex: number, weekIndex: number) => void;
  onContextMenu?: (e: React.MouseEvent, yearIndex: number, weekIndex: number) => void;
}

const statusClass: Record<WeekStatus, string> = {
  lived: styles.lived,
  current: styles.current,
  future: styles.future,
};

function buildGoalBackground(colors: string[]): string {
  if (colors.length === 0) return "";
  if (colors.length === 1) return colors[0];
  const stops = colors.join(", ");
  return `linear-gradient(to bottom, ${stops})`;
}

export function WeekCell({
  yearIndex,
  weekIndex,
  status,
  goalColors,
  isGoalTarget,
  goalTargetColor,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onContextMenu,
}: WeekCellProps) {
  const hasGoalRange = goalColors && goalColors.length > 0;

  const cellStyle: React.CSSProperties | undefined =
    isGoalTarget && goalTargetColor
      ? { ["--goal-color" as string]: goalTargetColor }
      : hasGoalRange
        ? { background: buildGoalBackground(goalColors) }
        : undefined;

  return (
    <div
      className={clsx(
        styles.cell,
        statusClass[status],
        isGoalTarget && styles.goalTarget,
        hasGoalRange && !isGoalTarget && styles.goalRange,
        onClick && status === "future" && styles.clickable
      )}
      role="gridcell"
      tabIndex={-1}
      aria-label={`Год ${yearIndex + 1}, неделя ${weekIndex + 1}`}
      style={cellStyle}
      onMouseEnter={(e) => onMouseEnter(e, yearIndex, weekIndex)}
      onMouseLeave={onMouseLeave}
      onClick={onClick ? (e) => onClick(e, yearIndex, weekIndex) : undefined}
      onContextMenu={
        onContextMenu
          ? (e) => onContextMenu(e, yearIndex, weekIndex)
          : undefined
      }
    />
  );
}
