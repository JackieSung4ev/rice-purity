import { pdf } from "@react-pdf/renderer";
import React from "react";
import { ReportSnapshot } from "../features/quiz/types";
import { ResultPdfDocument } from "./ResultPdfDocument";

export interface ExportProgress {
  status: "idle" | "generating" | "success" | "error";
  errorMessage?: string;
  blobUrl?: string;
}

/**
 * Generates and triggers browser download of the Result PDF report.
 */
export async function downloadResultPdf(snapshot: ReportSnapshot, onProgress?: (progress: ExportProgress) => void): Promise<{ success: boolean; blobUrl?: string; error?: string }> {
  try {
    onProgress?.({ status: "generating" });

    // Format date string for file name: YYYYMMDD-HHmm
    const d = new Date(snapshot.generatedAt);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    const langSuffix = snapshot.language === "bilingual" ? "bilingual" : snapshot.language;
    const fileName = `rice-purity-result-${yyyy}${mm}${dd}-${hh}${min}-${langSuffix}.pdf`;

    // Dynamic rendering using @react-pdf/renderer
    const docElement = React.createElement(ResultPdfDocument, { snapshot });
    const pdfInstance = pdf(docElement as any);
    const blob = await pdfInstance.toBlob();

    if (!blob || blob.size === 0) {
      throw new Error("Generated PDF is empty");
    }

    const blobUrl = URL.createObjectURL(blob);

    // Trigger download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Keep blob URL active for a brief moment, then revoke
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 60000);

    onProgress?.({ status: "success", blobUrl });
    return { success: true, blobUrl };
  } catch (err: any) {
    const msg = err?.message || "Failed to generate PDF";
    onProgress?.({ status: "error", errorMessage: msg });
    return { success: false, error: msg };
  }
}
