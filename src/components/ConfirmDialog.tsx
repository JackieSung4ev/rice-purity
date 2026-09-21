import React, { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, title, description, confirmText, cancelText, onConfirm, onCancel }) => {
  const { t } = useLanguage();
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Put default focus on cancel button for safety
      setTimeout(() => {
        cancelBtnRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onCancel();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="confirm-modal-backdrop"
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(20, 33, 61, 0.45)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 1000,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "var(--radius-card)",
          padding: "28px",
          maxWidth: "440px",
          width: "100%",
          boxShadow: "var(--shadow-modal)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#FEF3C7",
              color: "#D97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle size={22} />
          </div>
          <h3 id="confirm-dialog-title" style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--color-text)" }}>
            {title}
          </h3>
        </div>

        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "24px" }}>{description}</p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button
            ref={cancelBtnRef}
            onClick={onCancel}
            style={{
              padding: "10px 18px",
              borderRadius: "var(--radius-control)",
              backgroundColor: "var(--color-surface-hover)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
              fontSize: "0.95rem",
              fontWeight: 500,
            }}
          >
            {cancelText || t.cancelBtn}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "10px 18px",
              borderRadius: "var(--radius-control)",
              backgroundColor: "#DC2626",
              border: "1px solid #B91C1C",
              color: "#FFFFFF",
              fontSize: "0.95rem",
              fontWeight: 600,
            }}
          >
            {confirmText || t.confirmBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
