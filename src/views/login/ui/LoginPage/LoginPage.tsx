import { Header } from "@/widgets/header";
import { LoginForm } from "@/features/auth";
import styles from "./LoginPage.module.css";

export function LoginPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <LoginForm />
      </main>
    </div>
  );
}
