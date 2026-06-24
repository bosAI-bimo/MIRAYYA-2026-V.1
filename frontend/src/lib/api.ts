import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const fetcher = async (url: string, options: RequestInit = {}) => {
  try {
    let headers: any = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    if (options.body instanceof FormData) {
      delete headers["Content-Type"];
    }

    const res = await fetch(`${API_BASE_URL}${url}`, {
      cache: "no-store",
      credentials: "include",
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const error = new Error(errorData.error || errorData.message || "An error occurred while fetching data") as any;
      error.status = res.status;
      throw error;
    }

    return res.json();
  } catch (error: any) {
    if (error.status === 401) {
      // Optional: Redirect to login or handled by middleware
      toast.error("Sesi telah habis. Silakan login kembali.");
    } else {
      console.error(`API Error on ${url}:`, error);
      toast.error(error.message || "Terjadi kesalahan pada sistem.");
    }
    throw error;
  }
};

/**
 * Download a file from the API (CSV, PDF, etc.)
 * Uses fetch + Blob to trigger native browser download.
 */
export const downloadFile = async (url: string, filename: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      cache: "no-store",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || "Gagal mengunduh file");
    }

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    toast.success(`Berhasil mengunduh ${filename}`);
  } catch (error: any) {
    console.error(`Download Error on ${url}:`, error);
    toast.error(error.message || "Gagal mengunduh file.");
    throw error;
  }
};

