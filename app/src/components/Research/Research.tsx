import { useState } from 'react';
import { ArrowLeft, CalendarBlank, Tag } from '@phosphor-icons/react';
import articles from '../../data/research-articles';
import type { ResearchArticle } from '../../data/research-articles';
import styles from './Research.module.css';

function ArticleDetail({ article, onBack }: { article: ResearchArticle; onBack: () => void }) {
  return (
    <div className={styles.detail}>
      <button type="button" className={styles.backButton} onClick={onBack}>
        <ArrowLeft size={14} weight="bold" />
        All articles
      </button>
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
          {article.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}

export default function Research() {
  const [selected, setSelected] = useState<ResearchArticle | null>(null);

  if (selected) {
    return <ArticleDetail article={selected} onBack={() => setSelected(null)} />;
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
          <p className={styles.emptyHint}>
            Add entries to <code>src/data/research-articles.ts</code> to publish here.
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {articles.map((article) => (
            <button
              key={article.slug}
              type="button"
              className={styles.card}
              onClick={() => setSelected(article)}
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
