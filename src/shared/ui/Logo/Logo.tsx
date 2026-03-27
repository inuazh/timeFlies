import styles from "./Logo.module.css";

export function Logo() {
  return (
    <span className={styles.logo} aria-label="timeFlies — Календарь жизни">
      <svg
        className={styles.icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="url(#logoGrad)"
          strokeWidth="2"
        />
        <path
          d="M16 8v8l5.5 3.5"
          stroke="url(#logoGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="logoGrad" x1="4" y1="4" x2="28" y2="28">
            <stop stopColor="#00f0ff" />
            <stop offset="1" stopColor="#b44aff" />
          </linearGradient>
        </defs>
      </svg>
      <span className={styles.text}>timeFlies</span>
    </span>
  );
}
