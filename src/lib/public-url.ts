/** Shared URL boundary without bringing form-validation code into display components. */
export function isPublicHttpsUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      url.hostname.includes(".") &&
      !/^(?:\d+\.){3}\d+$/.test(url.hostname) &&
      !url.hostname.startsWith("[") &&
      !/(^|\.)(localhost|local|internal|test|invalid|example|home|lan)\.?$/i.test(
        url.hostname,
      )
    );
  } catch {
    return false;
  }
}
