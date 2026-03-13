import { useState, useCallback, useRef, useEffect } from 'react';
import { X, DownloadSimple, Check, LinkSimple, CircleNotch, TextAlignLeft } from '@phosphor-icons/react';
import styles from './ShareModal.module.css';

interface ShareModalProps {
  imageBlob: Blob;
  shareUrl: string;
  exportText: string;
  onClose: () => void;
}

export default function ShareModal({ imageBlob, shareUrl, exportText, onClose }: ShareModalProps) {
  const [imageUrl] = useState(() => URL.createObjectURL(imageBlob));
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const copiedLinkTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copiedTextTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(imageUrl);
      if (copiedLinkTimer.current) clearTimeout(copiedLinkTimer.current);
      if (copiedTextTimer.current) clearTimeout(copiedTextTimer.current);
    };
  }, [imageUrl]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleDownload = useCallback(() => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'meal-plan.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [imageUrl]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    if (copiedLinkTimer.current) clearTimeout(copiedLinkTimer.current);
    copiedLinkTimer.current = setTimeout(() => setCopiedLink(false), 1500);
  }, [shareUrl]);

  const handleCopyText = useCallback(() => {
    navigator.clipboard.writeText(exportText);
    setCopiedText(true);
    if (copiedTextTimer.current) clearTimeout(copiedTextTimer.current);
    copiedTextTimer.current = setTimeout(() => setCopiedText(false), 1500);
  }, [exportText]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.title}>Share Meal Plan</span>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.imageWrapper}>
            <img src={imageUrl} alt="Meal plan" className={styles.image} />
          </div>
          <button type="button" className={styles.downloadBtn} onClick={handleDownload}>
            <DownloadSimple size={14} weight="bold" />
            <span>Download Image</span>
          </button>
          <div className={styles.divider} />
          <div className={styles.linkSection}>
            <input
              type="text"
              className={styles.linkInput}
              value={shareUrl}
              readOnly
              onFocus={(e) => e.target.select()}
            />
            <button
              type="button"
              className={`${styles.copyBtn} ${copiedLink ? styles.copyBtnCopied : ''}`}
              onClick={handleCopyLink}
            >
              {copiedLink ? <Check size={14} /> : <LinkSimple size={14} />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
          <div className={styles.linkSection}>
            <textarea
              className={`${styles.linkInput} ${styles.textArea}`}
              value={exportText}
              readOnly
              rows={3}
              onFocus={(e) => e.target.select()}
            />
            <button
              type="button"
              className={`${styles.copyBtn} ${copiedText ? styles.copyBtnCopied : ''}`}
              onClick={handleCopyText}
            >
              {copiedText ? <Check size={14} /> : <TextAlignLeft size={14} />}
              <span>{copiedText ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ShareButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function ShareButton({ onClick, isLoading }: ShareButtonProps) {
  return (
    <button
      type="button"
      className={styles.shareButton}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading
        ? <CircleNotch size={14} className={styles.spinner} />
        : <DownloadSimple size={14} />}
      <span>{isLoading ? 'Generating...' : 'Share'}</span>
    </button>
  );
}
