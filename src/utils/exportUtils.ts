/**
 * Utility functions for exporting data to CSV, Excel-friendly TSV, and JSON
 * with UTF-8 BOM for proper Vietnamese diacritics support.
 */

export function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToCSV(data: any[], fileName: string) {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const rows = data.map((item) =>
    headers
      .map((header) => {
        let val = item[header];
        if (val === undefined || val === null) val = '';
        if (Array.isArray(val)) val = val.join('; ');
        const stringVal = String(val).replace(/"/g, '""');
        return `"${stringVal}"`;
      })
      .join(',')
  );

  // Add UTF-8 BOM (\uFEFF) for Excel
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  downloadFile(csvContent, `${fileName}.csv`, 'text/csv;charset=utf-8;');
}

export function exportToExcelTSV(data: any[], fileName: string) {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const rows = data.map((item) =>
    headers
      .map((header) => {
        let val = item[header];
        if (val === undefined || val === null) val = '';
        if (Array.isArray(val)) val = val.join('; ');
        return String(val).replace(/\t/g, ' ').replace(/\n/g, ' ');
      })
      .join('\t')
  );

  const tsvContent = '\uFEFF' + [headers.join('\t'), ...rows].join('\r\n');
  downloadFile(tsvContent, `${fileName}.xls`, 'application/vnd.ms-excel;charset=utf-8;');
}

export function exportToJSON(data: any, fileName: string) {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `${fileName}.json`, 'application/json;charset=utf-8;');
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  // Fallback
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return Promise.resolve(true);
  } catch {
    return Promise.resolve(false);
  }
}
