"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (!user) {
      dispatch(checkAuth()).then((result) => {
        if (result.meta.requestStatus === "rejected" || !result.payload) {
          router.push("/login");
        } else {
          dispatch(fetchGoals());
        }
      });
    } else {
      dispatch(fetchGoals());
    }
  }, [dispatch, user, router]);

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
