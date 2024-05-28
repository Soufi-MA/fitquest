import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStartOfWeek(today: Date) {
  const currentDay = today.getDay();
  const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
  const startDate = new Date(today.setDate(today.getDate() - daysToSubtract));
  startDate.setHours(0, 0, 0, 0);

  return startDate;
}
