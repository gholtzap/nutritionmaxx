import { copyText } from '../../utils/clipboard';
import type { RefObject } from 'react';
import IconButton from '../shared/IconButton';
import { useState, useCallback, useRef, useEffect, useId } from 'react';
import { X, DownloadSimple, Check, LinkSimple, CircleNotch, TextAlignLeft } from '@phosphor-icons/react';
import styles from './ShareModal.module.css';

interface ShareModalProps {
  imageBlob: Blob;
  shareUrl: string;
  exportText: string;
  onClose: () => void;
  returnFocus: RefObject<HTMLButtonElement | null>;
}

export default function ShareModal({ imageBlob, shareUrl, exportText, onClose, returnFocus }: ShareModalProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [copyError, setCopyError] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const copiedLinkTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copiedTextTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const imageUrl = URL.createObjectURL(imageBlob);
    if (imageRef.current) imageRef.current.src = imageUrl;
    return () => {
      URL.revokeObjectURL(imageUrl);
      if (copiedLinkTimer.current) clearTimeout(copiedLinkTimer.current);
      if (copiedTextTimer.current) clearTimeout(copiedTextTimer.current);
    };
  }, [imageBlob]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = returnFocus.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      opener?.focus();
    };
  }, [returnFocus]);

  const handleDownload = useCallback(() => {
    const a = document.createElement('a');
    if (!imageRef.current?.src) return;
    a.href = imageRef.current.src;
    a.download = 'meal-plan.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  const handleCopyLink = useCallback(async () => {
    try { await copyText(shareUrl); } catch { setCopyError(true); return; }
    setCopyError(false);
    setCopiedLink(true);
    if (copiedLinkTimer.current) clearTimeout(copiedLinkTimer.current);
    copiedLinkTimer.current = setTimeout(() => setCopiedLink(false), 1500);
  }, [shareUrl]);

  const handleCopyText = useCallback(async () => {
    try { await copyText(exportText); } catch { setCopyError(true); return; }
    setCopyError(false);
    setCopiedText(true);
    if (copiedTextTimer.current) clearTimeout(copiedTextTimer.current);
    copiedTextTimer.current = setTimeout(() => setCopiedText(false), 1500);
  }, [exportText]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  return (
    <dialog ref={dialogRef} className={styles.backdrop} aria-labelledby={titleId} onCancel={onClose} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span id={titleId} className={styles.title}>Share weekly plan</span>
          <IconButton type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close share dialog">
            <X size={16} />
          </IconButton>
        </div>
        <div className={styles.body}>
          <div className={styles.imageWrapper}>
            <img ref={imageRef} alt="Weekly plan" className={styles.image} />
          </div>
          <button type="button" className={styles.downloadBtn} onClick={handleDownload}>
            <DownloadSimple size={14} weight="bold" />
            <span>Download image</span>
          </button>
          <div className={styles.divider} />
          <div className={styles.linkSection}>
            <input
              type="text"
              className={styles.linkInput}
              aria-label="Plan link"
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
              <span>{copiedLink ? 'Copied' : 'Copy link'}</span>
            </button>
          </div>
          <div className={styles.linkSection}>
            <textarea
              className={`${styles.linkInput} ${styles.textArea}`}
              aria-label="Plan text"
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
              <span>{copiedText ? 'Copied' : 'Copy text'}</span>
            </button>
          </div>
          {copyError && <p role="alert">Copy failed. Select the text and copy it manually.</p>}
        </div>
      </div>
    </dialog>
  );
}

interface ShareButtonProps {
  onClick: () => void;
  isLoading: boolean;
  buttonRef: RefObject<HTMLButtonElement | null>;
}

export function ShareButton({ onClick, isLoading, buttonRef }: ShareButtonProps) {
  return (
    <button
      type="button"
      className={styles.shareButton}
      ref={buttonRef}
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
