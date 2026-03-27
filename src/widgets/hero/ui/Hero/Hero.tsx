import Link from "next/link";
import { Button } from "@/shared/ui";
import { LIFE_EXPECTANCY_YEARS, WEEKS_PER_YEAR, TOTAL_WEEKS } from "@/shared/lib/dates";
import styles from "./Hero.module.css";

function MiniGrid() {
  const livedRatio = 0.35;
  const livedCount = Math.floor(TOTAL_WEEKS * livedRatio);
  const cells: React.ReactNode[] = [];

  for (let i = 0; i < TOTAL_WEEKS; i++) {
    cells.push(
      <div
        key={i}
        className={i < livedCount ? styles.miniCell : styles.miniCellDim}
      />
    );
  }

  return <div className={styles.miniGrid}>{cells}</div>;
}

export function Hero() {
  return (
    <section className={styles.hero}>
      <MiniGrid />
      <div className={styles.content}>
        <h1 className={styles.title}>Твоя жизнь в неделях</h1>
        <p className={styles.description}>
          Каждый квадратик — одна неделя. {LIFE_EXPECTANCY_YEARS} лет. {TOTAL_WEEKS.toLocaleString("ru-RU")}{" "}
          недель. Увидь свою жизнь целиком — и начни ценить каждую из них.
        </p>

        <div className={styles.actions}>
          <Link href="/register">
            <Button>Начать</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary">Войти</Button>
          </Link>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNumber}>{LIFE_EXPECTANCY_YEARS}</div>
            <div className={styles.statLabel}>лет</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>{WEEKS_PER_YEAR}</div>
            <div className={styles.statLabel}>недели в году</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>{TOTAL_WEEKS.toLocaleString("ru-RU")}</div>
            <div className={styles.statLabel}>недель всего</div>
          </div>
        </div>
      </div>
    </section>
  );
}
