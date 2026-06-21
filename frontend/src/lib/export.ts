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
