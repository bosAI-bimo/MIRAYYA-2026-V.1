export async function downloadFile(url: string, filename: string) {
  try {
    const res = await fetch(url, {
      method: "GET",
      // Include auth token if your backend requires it
      // headers: { "Authorization": `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error("Failed to download file");
    }

    const blob = await res.blob();
    const urlBlob = window.URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = urlBlob;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(urlBlob);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
}

export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  
  const separator = ',';
  const keys = Object.keys(rows[0]);
  
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows.map(row => {
      return keys.map(k => {
        let cell = row[k] === null || row[k] === undefined ? '' : row[k];
        let cellString = cell instanceof Date ? cell.toLocaleString() : String(cell).replace(/"/g, '""');
        if (cellString.search(/("|,|\n)/g) >= 0) cellString = `"${cellString}"`;
        return cellString;
      }).join(separator);
    }).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
