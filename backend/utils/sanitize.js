// Helper to mask sensitive fields in objects for safe logging
function maskSensitive(obj, sensitiveKeys = ["password", "pwd", "pass"]) {
  if (obj == null || typeof obj !== "object") return obj;

  const isArr = Array.isArray(obj);
  const out = isArr ? [] : {};

  for (const [k, v] of Object.entries(obj)) {
    const keyLower = k.toLowerCase();
    if (sensitiveKeys.includes(keyLower)) {
      if (v === undefined || v === null || v === "") {
        out[k] = "missing";
      } else {
        out[k] = "***";
      }
    } else if (typeof v === "object" && v !== null) {
      out[k] = maskSensitive(v, sensitiveKeys);
    } else {
      out[k] = v;
    }
  }

  return out;
}

export default maskSensitive;
