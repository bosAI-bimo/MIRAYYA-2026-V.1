import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const fetcher = async (url: string, options: RequestInit = {}) => {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      cache: "no-store",
      credentials: "include",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
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
