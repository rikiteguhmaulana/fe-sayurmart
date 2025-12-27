import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL?.replace(/['"]/g, ""),
  // timeout 1 minutes
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export function setAuthToken(token: string | null) {
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
}

instance.interceptors.request.use(async (config) => {
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers["Content-Type"];
    }
  }

  if (typeof window === "undefined") return config; // hanya di client
  const session = await getSession();
  const token = (session as any)?.user?.token ?? (session as any)?.user?.token;
  if (token && config.headers)
    config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await signOut({ callbackUrl: "/auth/login" });
    }
    return Promise.reject(error);
  }
);

export default instance;
