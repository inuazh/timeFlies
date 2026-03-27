"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { register } from "../../model";
import { Button, Input } from "@/shared/ui";
import glass from "@/shared/styles/glass.module.css";
import styles from "./RegisterForm.module.css";
import clsx from "clsx";

export function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error } = useAppSelector((s) => s.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await dispatch(register({ name, email, password, birthDate }));
    if (result.meta.requestStatus === "fulfilled") {
      router.push("/dashboard");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx(glass.card, styles.form)}
    >
      <h1 className={styles.title}>Регистрация</h1>
      <p className={styles.subtitle}>
        Создайте аккаунт и увидьте свою жизнь в неделях
      </p>

      {error && <div className={styles.error} role="alert">{error}</div>}

      <Input
        label="Имя"
        type="text"
        placeholder="Как вас зовут"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        autoComplete="name"
      />

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
        minLength={6}
        autoComplete="new-password"
      />

      <Input
        label="Дата рождения"
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        required
        max={new Date().toISOString().split("T")[0]}
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Создание аккаунта..." : "Создать аккаунт"}
      </Button>

      <p className={styles.footer}>
        Уже есть аккаунт?{" "}
        <Link href="/login">Войти</Link>
      </p>
    </form>
  );
}
