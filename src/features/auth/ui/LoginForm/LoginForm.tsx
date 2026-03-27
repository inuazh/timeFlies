"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { login } from "../../model";
import { Button, Input } from "@/shared/ui";
import glass from "@/shared/styles/glass.module.css";
import styles from "./LoginForm.module.css";
import clsx from "clsx";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error } = useAppSelector((s) => s.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (result.meta.requestStatus === "fulfilled") {
      router.push("/dashboard");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx(glass.card, styles.form)}
    >
      <h1 className={styles.title}>Вход</h1>
      <p className={styles.subtitle}>Войдите, чтобы увидеть свой календарь жизни</p>

      {error && <div className={styles.error} role="alert">{error}</div>}

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />

      <Input
        label="Пароль"
        type="password"
        placeholder="Минимум 6 символов"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Вход..." : "Войти"}
      </Button>

      <p className={styles.footer}>
        Нет аккаунта?{" "}
        <Link href="/register">Зарегистрироваться</Link>
      </p>
    </form>
  );
}
