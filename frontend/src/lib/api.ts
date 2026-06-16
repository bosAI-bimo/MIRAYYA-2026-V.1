const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const fetcher = async (url: string, options: RequestInit = {}) => {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      cache: "no-store",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || "An error occurred while fetching data");
    }

    return res.json();
  } catch (error) {
    console.error(`API Error on ${url}:`, error);
    throw error;
  }
};
