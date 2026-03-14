import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, CalendarBlank, Tag, LinkSimple, Check } from '@phosphor-icons/react';
import articles from '../../data/research-articles';
import type { ResearchArticle, ContentBlock } from '../../data/research-articles';
import styles from './Research.module.css';

function barStatus(pct: number) {
  if (pct < 50) return 'verylow';
  if (pct < 80) return 'low';
  if (pct <= 120) return 'ok';
  if (pct <= 200) return 'high';
  return 'veryhigh';
}

function progressColor(rmse: number) {
  if (rmse > 40) return '#ef4444';
  if (rmse > 25) return '#f59e0b';
  if (rmse > 15) return '#63b3ed';
  return '#10b981';
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'text':
      return <p className={styles.bodyText}>{block.value}</p>;

    case 'heading':
      return <h2 className={styles.sectionHeading}>{block.value}</h2>;

    case 'divider':
      return <hr className={styles.divider} />;

    case 'stats':
      return (
        <div className={styles.statsRow}>
          {block.items.map((s, j) => (
            <div key={j} className={styles.statCard}>
              <span className={styles.statValue} style={{ color: s.color }}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      );

    case 'bars':
      return (
        <div className={styles.barsBlock}>
          {block.title && <div className={styles.barsTitle}>{block.title}</div>}
          <div className={styles.barsList}>
            {block.items.map((b, j) => {
              const status = barStatus(b.pct);
              const width = Math.min(b.pct, 150) / 1.5;
              return (
                <div key={j} className={styles.barRow}>
                  <span className={styles.barLabel}>{b.label}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      data-status={status}
                      style={{ width: `${width}%` }}
                    />
                    <div className={styles.barTarget} />
                  </div>
                  <span className={styles.barPct} data-status={status}>
                    {Math.round(b.pct)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );

    case 'progress': {
      const maxRmse = Math.max(...block.items.map(i => i.rmse));
      return (
        <div className={styles.progressBlock}>
          {block.items.map((p, j) => {
            const width = (p.rmse / maxRmse) * 100;
            return (
              <div key={j} className={styles.progressRow}>
                <span className={styles.progressK}>{p.k}</span>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${width}%`, background: progressColor(p.rmse) }}
                  />
                </div>
                <span className={styles.progressRmse}>{p.rmse}</span>
                <span className={styles.progressLabel}>{p.label}</span>
              </div>
            );
          })}
        </div>
      );
    }

    case 'foods':
      return (
        <div className={styles.foodsBlock}>
          {block.items.map((f, j) => (
            <div key={j} className={styles.foodRow}>
              <span className={styles.foodName}>{f.name}</span>
              <span className={styles.foodServings}>{f.servings}</span>
              <span className={styles.foodDetail}>{f.detail}</span>
            </div>
          ))}
          {block.calories && (
            <div className={styles.foodsCalories}>{block.calories} kcal / day</div>
          )}
        </div>
      );

    case 'callout':
      return (
        <div className={styles.callout} data-tone={block.tone}>
          <div className={styles.calloutTitle}>{block.title}</div>
          <div className={styles.calloutBody}>{block.value}</div>
        </div>
      );
  }
}

function ShareButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  const handleCopy = useCallback(() => {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('research', slug);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  }, [slug]);

  return (
    <button type="button" className={styles.shareBtn} onClick={handleCopy}>
      {copied ? <Check size={13} /> : <LinkSimple size={13} />}
      <span>{copied ? 'Copied' : 'Share'}</span>
    </button>
  );
}

function ArticleDetail({ article, onBack }: { article: ResearchArticle; onBack: () => void }) {
  return (
    <div className={styles.detail}>
      <div className={styles.detailNav}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={14} weight="bold" />
          All articles
        </button>
        <ShareButton slug={article.slug} />
      </div>
      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <h1 className={styles.articleTitle}>{article.title}</h1>
          <div className={styles.articleMeta}>
            <span className={styles.metaItem}>
              <CalendarBlank size={13} weight="regular" />
              {article.date}
            </span>
            {article.tags.length > 0 && (
              <span className={styles.metaItem}>
                <Tag size={13} weight="regular" />
                {article.tags.join(', ')}
              </span>
            )}
          </div>
        </header>
        <div className={styles.articleBody}>
          {article.content.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </article>
    </div>
  );
}

export default function Research() {
  const [selected, setSelected] = useState<ResearchArticle | null>(() => {
    const slug = new URLSearchParams(window.location.search).get('research');
    if (!slug) return null;
    return articles.find((a) => a.slug === slug) ?? null;
  });

  const selectArticle = useCallback((article: ResearchArticle) => {
    setSelected(article);
    const url = new URL(window.location.href);
    url.searchParams.set('research', article.slug);
    url.searchParams.delete('food');
    url.searchParams.delete('compare');
    url.searchParams.delete('plan');
    window.history.replaceState(null, '', url.toString());
  }, []);

  const clearSelection = useCallback(() => {
    setSelected(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('research');
    window.history.replaceState(null, '', url.toString());
  }, []);

  if (selected) {
    return <ArticleDetail article={selected} onBack={clearSelection} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Research</h1>
        <p className={styles.subtitle}>Experiments and findings from the nutrition dataset</p>
      </div>
      {articles.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No articles yet.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {articles.map((article) => (
            <button
              key={article.slug}
              type="button"
              className={styles.card}
              onClick={() => selectArticle(article)}
            >
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{article.title}</h2>
                <p className={styles.cardSummary}>{article.summary}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.cardDate}>{article.date}</span>
                  {article.tags.map((tag) => (
                    <span key={tag} className={styles.cardTag}>{tag}</span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
