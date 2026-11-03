export async function hashPin(pin, salt) {
  const bytes = new TextEncoder().encode(`${salt}:${pin}`);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
