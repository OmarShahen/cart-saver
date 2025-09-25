export function generateUniqueCode(prefix = "SAVE", length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  // removed 0, O, I, 1 for clarity

  let randomPart = "";
  for (let i = 0; i < length; i++) {
    randomPart += chars[Math.floor(Math.random() * chars.length)];
  }

  // timestamp in base36 ensures uniqueness
  const uniquePart = Date.now().toString(36).toUpperCase().slice(-4);

  return `${prefix}-${randomPart}${uniquePart}`;
}
