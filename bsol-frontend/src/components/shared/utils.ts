export const normalizeUrl = (url: string) => {
  if (!url) return "";
  return url.startsWith("data:") ? url : `http://localhost:8080${url}`;
};
