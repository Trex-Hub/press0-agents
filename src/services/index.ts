// LOGGER
import logger from "@/utils/logger";

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: Error | null;
}

export class ApiService {
  private baseUrl: string = "";

  constructor(baseUrl?: string) {
    if (baseUrl) {
      this.setBaseUrl(baseUrl);
    }
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  async fetchData<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<FetchState<T>> {
    const state: FetchState<T> = {
      data: null,
      isLoading: true,
      isError: false,
      isSuccess: false,
      error: null,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      logger.info(`API call to ${endpoint} successful`);
      
      const data = await response.json();

      return {
        ...state,
        data,
        isLoading: false,
        isSuccess: true,
      };
    } catch (error) {
      // If AbortError, keep the original error
      logger.error(`API call to ${endpoint} failed`);
      logger.error(`[ERROR LOG] ${error instanceof Error ? error.message : 'Unknown error'}`);
      if (error instanceof Error && error.name === "AbortError") {
        throw error;
      }

      return {
        ...state,
        isLoading: false,
        isError: true,
        error: error instanceof Error ? error : new Error("An error occurred"),
      };
    }
  }

  // Convenience methods for different HTTP methods
  async get<T>(endpoint: string, options?: RequestInit) {
    logger.info(`API call to ${endpoint} successful`);
    return this.fetchData<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, body: any, options?: RequestInit) {
    // Determine if body should be sent as JSON or form data.
    const isFormBody =
      body instanceof FormData || body instanceof URLSearchParams;
    const headers = isFormBody
      ? { ...options?.headers }
      : { "Content-Type": "application/json", ...options?.headers };

    return this.fetchData<T>(endpoint, {
      ...options,
      method: "POST",
      body: isFormBody ? body : JSON.stringify(body),
      headers,
    });
  }

  async put<T>(endpoint: string, body: any, options?: RequestInit) {
    return this.fetchData<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit) {
    return this.fetchData<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export default new ApiService();
