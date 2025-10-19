/**
 * Export utilities for clinical notes
 */

import { jsPDF } from 'jspdf';

export interface ExportMetadata {
  template: string;
  timestamp: string;
  redactionCount?: number;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch (fallbackError) {
      document.body.removeChild(textarea);
      return false;
    }
  }
}

/**
 * Download text as .txt file
 */
export function downloadAsText(
  content: string,
  filename: string,
  metadata?: ExportMetadata
): void {
  let fullContent = content;
  
  if (metadata) {
    fullContent = `${content}\n\n---\nTemplate: ${metadata.template}\nGenerated: ${metadata.timestamp}`;
    if (metadata.redactionCount !== undefined) {
      fullContent += `\nPHI Redactions: ${metadata.redactionCount}`;
    }
  }

  const blob = new Blob([fullContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.txt') ? filename : `${filename}.txt`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download as PDF
 */
export function downloadAsPDF(
  content: string,
  filename: string,
  metadata?: ExportMetadata
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('NovaCare - Clinical Note', 15, 20);

  // Metadata
  if (metadata) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`Template: ${metadata.template}`, 15, 30);
    doc.text(`Generated: ${metadata.timestamp}`, 15, 35);
    if (metadata.redactionCount !== undefined) {
      doc.text(`PHI Redactions: ${metadata.redactionCount}`, 15, 40);
    }
    
    // Separator
    doc.setDrawColor(200);
    doc.line(15, 45, 195, 45);
  }

  // Content
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  
  const startY = metadata ? 52 : 30;
  const maxWidth = 180;
  const lineHeight = 6;
  
  // Split content into lines
  const lines = doc.splitTextToSize(content, maxWidth);
  
  let yPosition = startY;
  lines.forEach((line: string) => {
    // Add new page if needed
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.text(line, 15, yPosition);
    yPosition += lineHeight;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount} • No-PHI Pilot Mode • For demonstration only`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save
  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}

/**
 * Generate a filename based on template and timestamp
 */
export function generateFilename(template: string, extension: 'txt' | 'pdf'): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  return `NurseScribe_${template}_${timestamp}.${extension}`;
}
