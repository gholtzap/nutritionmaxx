import { Warning } from '@phosphor-icons/react';
import styles from './RateLimitNotice.module.css';

interface RateLimitNoticeProps {
  retryAfterMs: number;
}

export default function RateLimitNotice({ retryAfterMs }: RateLimitNoticeProps) {
  const seconds = Math.ceil(retryAfterMs / 1000);

  return (
    <div className={styles.notice}>
      <Warning size={14} weight="fill" />
      <span>Too many requests. Try again in {seconds}s.</span>
    </div>
  );
}
