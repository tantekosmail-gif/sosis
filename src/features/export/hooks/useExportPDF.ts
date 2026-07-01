"use client";

import { useState } from "react";

export function useExportPDF() {
  const [exporting, setExporting] = useState(false);

  async function exportPDF(elementId: string, filename = "sentimentai-report.pdf") {
    setExporting(true);
    try {
      const [{ toPng }, { default: jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);

      const el = document.getElementById(elementId);
      if (!el) throw new Error("Element not found");

      const dataUrl = await toPng(el, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#f8fafc",
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((res) => { img.onload = res; });

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const imgW = pageW - margin * 2;
      const imgH = (img.height / img.width) * imgW;

      let remaining = imgH;
      let sourceY = 0;
      let firstPage = true;

      while (remaining > 0) {
        if (!firstPage) pdf.addPage();
        firstPage = false;

        const sliceH = Math.min(remaining, pageH - margin * 2);
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = img.width * 2;
        sliceCanvas.height = Math.round(sliceH * (img.width * 2 / imgW));
        const ctx = sliceCanvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, sourceY, img.width * 2, sliceCanvas.height, 0, 0, sliceCanvas.width, sliceCanvas.height);
        }

        pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", margin, margin, imgW, sliceH);
        remaining -= sliceH;
        sourceY += sliceCanvas.height;
      }

      pdf.save(filename);
    } finally {
      setExporting(false);
    }
  }

  return { exportPDF, exporting };
}
