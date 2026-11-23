import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

export function CopyButton({
  text,
  label,
  children,
}: {
  text: string | (() => string);
  label: string;
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(typeof text === "function" ? text() : text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked; nothing useful to do
    }
  };

  return (
    <button className={children ? "button" : "icon-button"} onClick={copy} aria-label={label}>
      {copied ? <FiCheck /> : <FiCopy />}
      {children && <span>{copied ? "Copied" : children}</span>}
    </button>
  );
}
