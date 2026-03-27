"use client";

import { useState } from "react";
import type { WeekInfo } from "@/shared/lib/dates";
import { Button, Input } from "@/shared/ui";
import glass from "@/shared/styles/glass.module.css";
import styles from "./GoalModal.module.css";
import clsx from "clsx";

interface GoalModalProps {
  isOpen: boolean;
  weekInfo: WeekInfo;
  onClose: () => void;
  onSubmit: (title: string) => void;
  error?: string | null;
}

export function GoalModal({
  isOpen,
  weekInfo,
  onClose,
  onSubmit,
  error,
}: GoalModalProps) {
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim());
      setTitle("");
    }
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Создание цели"
    >
      <form
        className={clsx(glass.card, styles.modal)}
        onSubmit={handleSubmit}
      >
        <h2 className={styles.title}>Новая цель</h2>

        <div className={styles.weekInfo}>
          <span className={styles.weekInfoHighlight}>
            Год {weekInfo.year + 1}, Неделя {weekInfo.week + 1}
          </span>
          <br />
          {weekInfo.startDate} — {weekInfo.endDate}
        </div>

        {error && <div className={styles.error} role="alert">{error}</div>}

        <Input
          label="Название цели"
          placeholder="Например: купить машину"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" disabled={!title.trim()}>
            Создать
          </Button>
        </div>
      </form>
    </div>
  );
}
