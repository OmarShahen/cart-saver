export function addDatesHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export function formatDateForTitle(date: Date): string {
  // Get YYYY-MM-DD
  const datePart = date.toISOString().split("T")[0];

  // Get HH:mm AM/PM
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 -> 12

  const timePart = `${hours}:${minutes} ${ampm}`;

  return `${datePart} ${timePart}`;
}
