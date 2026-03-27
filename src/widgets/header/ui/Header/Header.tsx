"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth";
import { Logo, Button } from "@/shared/ui";
import styles from "./Header.module.css";

export function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((s) => s.user.data);

  async function handleLogout() {
    await dispatch(logout());
    router.push("/");
  }

  return (
    <header className={styles.header}>
      <Link href={user ? "/dashboard" : "/"}>
        <Logo />
      </Link>

      {user ? (
        <div className={styles.userSection}>
          <span className={styles.userName}>{user.name}</span>
          <Button variant="ghost" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      ) : (
        <nav className={styles.nav}>
          <Link href="/login">
            <Button variant="ghost">Войти</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">Регистрация</Button>
          </Link>
        </nav>
      )}
    </header>
  );
}
