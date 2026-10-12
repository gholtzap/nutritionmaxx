export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch { return fallbackCopy(text); }
  }
  fallbackCopy(text);
}

function fallbackCopy(text: string) {
  const textarea = document.createElement('textarea');
  const previous = document.activeElement;
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  try {
    textarea.focus();
    textarea.select();
    if (!document.execCommand('copy')) throw new Error('Copy failed');
  } finally {
    textarea.remove();
    if (previous instanceof HTMLElement) previous.focus();
  }
}
