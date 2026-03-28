"use client";

import { useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { WeekCell } from "@/entities/week";
import { GOAL_COLORS, type Goal } from "@/entities/goal";
import { WeekTooltip } from "@/features/week-tooltip";
import { GoalModal, createGoal, deleteGoal } from "@/features/goal-management";
import {
  LIFE_EXPECTANCY_YEARS,
  WEEKS_PER_YEAR,
  getLifeStats,
  getWeekInfo,
} from "@/shared/lib/dates";
import type { WeekInfo, WeekStatus } from "@/shared/lib/dates";
import { Button } from "@/shared/ui";
import glass from "@/shared/styles/glass.module.css";
import styles from "./LifeGrid.module.css";
import clsx from "clsx";

interface LifeGridProps {
  birthDate: string;
}

interface ContextMenuState {
  x: number;
  y: number;
  goals: Array<{ id: number; title: string; color: string }>;
}

const MONTH_LABELS = [
  "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
  "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек",
];

const MONTH_START_WEEKS = [0, 4, 9, 13, 17, 22, 26, 30, 35, 39, 43, 48];

function computeGrid(birthDate: string): { grid: WeekStatus[][]; livedWeeks: number } {
  const stats = getLifeStats(birthDate);
  const grid: WeekStatus[][] = [];

  for (let y = 0; y < LIFE_EXPECTANCY_YEARS; y++) {
    const row: WeekStatus[] = [];
    for (let w = 0; w < WEEKS_PER_YEAR; w++) {
      const weekNum = y * WEEKS_PER_YEAR + w;
      if (weekNum < stats.livedWeeks) {
        row.push("lived");
      } else if (weekNum === stats.livedWeeks) {
        row.push("current");
      } else {
        row.push("future");
      }
    }
    grid.push(row);
  }

  return { grid, livedWeeks: stats.livedWeeks };
}

function getGoalColorsForWeek(
  goals: Goal[],
  currentWeekNum: number,
  weekNum: number
): string[] {
  const colors: string[] = [];
  for (const goal of goals) {
    const goalWeekNum = goal.targetYear * WEEKS_PER_YEAR + goal.targetWeek;
    if (goalWeekNum <= currentWeekNum) continue;
    if (weekNum > currentWeekNum && weekNum <= goalWeekNum) {
      colors.push(GOAL_COLORS[goal.colorIndex]);
    }
  }
  return colors;
}

function getGoalTargetInfo(
  goals: Goal[],
  yearIndex: number,
  weekIndex: number
): { color: string } | null {
  for (const goal of goals) {
    if (goal.targetYear === yearIndex && goal.targetWeek === weekIndex) {
      return { color: GOAL_COLORS[goal.colorIndex] };
    }
  }
  return null;
}

function getGoalsForWeek(
  goals: Goal[],
  currentWeekNum: number,
  yearIndex: number,
  weekIndex: number
): Array<{ title: string; color: string }> {
  const weekNum = yearIndex * WEEKS_PER_YEAR + weekIndex;
  const result: Array<{ title: string; color: string }> = [];

  for (const goal of goals) {
    const goalWeekNum = goal.targetYear * WEEKS_PER_YEAR + goal.targetWeek;
    if (weekNum >= currentWeekNum && weekNum <= goalWeekNum) {
      result.push({ title: goal.title, color: GOAL_COLORS[goal.colorIndex] });
    }
  }

  return result;
}

function getGoalTargetsAtWeek(
  goals: Goal[],
  yearIndex: number,
  weekIndex: number
): Array<{ id: number; title: string; color: string }> {
  const result: Array<{ id: number; title: string; color: string }> = [];
  for (const goal of goals) {
    if (goal.targetYear === yearIndex && goal.targetWeek === weekIndex) {
      result.push({
        id: goal.id,
        title: goal.title,
        color: GOAL_COLORS[goal.colorIndex],
      });
    }
  }
  return result;
}

export function LifeGrid({ birthDate }: LifeGridProps) {
  const dispatch = useAppDispatch();
  const goals = useAppSelector((s) => s.goal.items);
  const goalError = useAppSelector((s) => s.goal.error);

  const gridRef = useRef<HTMLDivElement>(null);
  const [tooltipInfo, setTooltipInfo] = useState<WeekInfo | null>(null);
  const [tooltipGoals, setTooltipGoals] = useState<Array<{ title: string; color: string }>>([]);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [modalWeekInfo, setModalWeekInfo] = useState<WeekInfo | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const { grid, livedWeeks } = computeGrid(birthDate);

  function handleMouseEnter(
    e: React.MouseEvent,
    yearIndex: number,
    weekIndex: number
  ) {
    const info = getWeekInfo(birthDate, yearIndex, weekIndex);
    setTooltipInfo(info);
    setTooltipPos({ x: e.clientX, y: e.clientY });
    setTooltipGoals(getGoalsForWeek(goals, livedWeeks, yearIndex, weekIndex));
  }

  function handleMouseLeave() {
    setTooltipInfo(null);
    setTooltipGoals([]);
  }

  function handleCellClick(
    _e: React.MouseEvent,
    yearIndex: number,
    weekIndex: number
  ) {
    setContextMenu(null);
    const weekNum = yearIndex * WEEKS_PER_YEAR + weekIndex;
    if (weekNum <= livedWeeks) return;

    const info = getWeekInfo(birthDate, yearIndex, weekIndex);
    setModalWeekInfo(info);
  }

  function handleContextMenu(
    e: React.MouseEvent,
    yearIndex: number,
    weekIndex: number
  ) {
    const targets = getGoalTargetsAtWeek(goals, yearIndex, weekIndex);
    if (targets.length === 0) return;

    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, goals: targets });
  }

  function handleDeleteGoal(goalId: number) {
    dispatch(deleteGoal(goalId));
    setContextMenu(null);
  }

  function handleCloseContextMenu() {
    setContextMenu(null);
  }

  function handleModalClose() {
    setModalWeekInfo(null);
  }

  async function handleGoalSubmit(title: string) {
    if (!modalWeekInfo) return;
    const result = await dispatch(
      createGoal({
        title,
        targetYear: modalWeekInfo.year,
        targetWeek: modalWeekInfo.week,
      })
    );
    if (result.meta.requestStatus === "fulfilled") {
      setModalWeekInfo(null);
    }
  }

  function handlePrint() {
    const node = gridRef.current;
    if (!node) return;

    const clone = node.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("[data-print-hide]").forEach((el) => el.remove());
    clone.querySelectorAll("[role=tooltip]").forEach((el) => el.remove());

    const root = document.createElement("div");
    root.id = "__printRoot";
    root.appendChild(clone);
    document.body.appendChild(root);

    const cleanup = () => {
      document.body.removeChild(root);
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);

    window.print();
  }

  return (
    <div ref={gridRef} className={clsx(glass.card, styles.container)} role="grid" aria-label="Календарь жизни">
      <div className={styles.toolbar} data-print-hide>
        <Button variant="ghost" onClick={handlePrint} aria-label="Сохранить как PDF">
          Экспорт PDF
        </Button>
      </div>
      <div className={styles.monthRow}>
        <span className={styles.monthSpacer} />
        {Array.from({ length: WEEKS_PER_YEAR }, (_, w) => {
          const monthIdx = MONTH_START_WEEKS.indexOf(w);
          return (
            <span key={w} className={styles.monthLabel}>
              {monthIdx !== -1 ? MONTH_LABELS[monthIdx] : ""}
            </span>
          );
        })}
      </div>

      <div className={styles.grid} data-life-grid>
        {grid.map((row, y) => (
          <div key={y} className={styles.row} role="row">
            <span className={styles.yearLabel}>
              {y % 5 === 0 ? y : ""}
            </span>
            {row.map((status, w) => {
              const weekNum = y * WEEKS_PER_YEAR + w;
              const targetInfo = getGoalTargetInfo(goals, y, w);
              const goalColors =
                status === "future" && !targetInfo
                  ? getGoalColorsForWeek(goals, livedWeeks, weekNum)
                  : undefined;

              return (
                <WeekCell
                  key={w}
                  yearIndex={y}
                  weekIndex={w}
                  status={status}
                  goalColors={goalColors}
                  isGoalTarget={!!targetInfo}
                  goalTargetColor={targetInfo?.color}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleCellClick}
                  onContextMenu={handleContextMenu}
                />
              );
            })}
          </div>
        ))}
      </div>

      <WeekTooltip
        weekInfo={tooltipInfo}
        position={tooltipPos}
        activeGoals={tooltipGoals}
      />

      {contextMenu && (
        <div
          className={styles.contextOverlay}
          onClick={handleCloseContextMenu}
          onContextMenu={(e) => {
            e.preventDefault();
            handleCloseContextMenu();
          }}
        >
          <div
            className={clsx(glass.card, styles.contextMenu)}
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            {contextMenu.goals.map((g) => (
              <button
                key={g.id}
                className={styles.contextItem}
                onClick={() => handleDeleteGoal(g.id)}
              >
                <span
                  className={styles.contextDot}
                  style={{ backgroundColor: g.color }}
                />
                <span className={styles.contextTitle}>Удалить: {g.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {modalWeekInfo && (
        <GoalModal
          isOpen
          weekInfo={modalWeekInfo}
          onClose={handleModalClose}
          onSubmit={handleGoalSubmit}
          error={goalError}
        />
      )}
    </div>
  );
}
