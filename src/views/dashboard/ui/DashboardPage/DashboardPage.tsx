"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { checkAuth } from "@/features/auth";
import { fetchGoals } from "@/features/goal-management";
import { Header } from "@/widgets/header";
import { LifeGrid } from "@/widgets/life-grid";
import { StatsSidebar } from "@/widgets/stats-sidebar";
import styles from "./DashboardPage.module.css";

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: user, isLoading } = useAppSelector((s) => s.user);
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    if (!user) {
      setNetworkError(false);
      dispatch(checkAuth()).then((result) => {
        if (result.meta.requestStatus === "rejected") {
          // Сетевая ошибка — сервер спит, не редиректим
          setNetworkError(true);
        } else if (!result.payload) {
          // 401 — токен невалиден, идём на логин
          router.push("/login");
        } else {
          dispatch(fetchGoals());
        }
      });
    } else {
      dispatch(fetchGoals());
    }
  }, [dispatch, user, router]);

  if (networkError) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.loading}>
          Сервер недоступен.{" "}
          <button onClick={() => setNetworkError(false)}>
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !user) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <LifeGrid birthDate={user.birthDate} />
        <StatsSidebar birthDate={user.birthDate} />
      </main>
    </div>
  );
}
