import { Header } from "@/widgets/header";
import { RegisterForm } from "@/features/auth";
import styles from "./RegisterPage.module.css";

export function RegisterPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <RegisterForm />
      </main>
    </div>
  );
}
