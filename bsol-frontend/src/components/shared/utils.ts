import { BASE_URL } from "@/lib/api";

const IMAGE_HOST = BASE_URL.split("/uv-api")[0];

export const normalizeUrl = (url: string) => {
  if (!url) return "";
  return url.startsWith("data:") ? url : `${IMAGE_HOST}${url}`;
};
