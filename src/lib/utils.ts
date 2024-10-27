import { type ClassValue, clsx } from "clsx";
import { timestamp } from "drizzle-orm/pg-core";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStartOfWeek(today: Date) {
  const currentDay = today.getDay();
  const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - daysToSubtract);
  startDate.setHours(6, 0, 0, 0);

  return startDate;
}

export const getDateFromSearchParams = (
  dateString: string | undefined | null
): Date => {
  const date =
    dateString && !isNaN(Date.parse(dateString))
      ? new Date(dateString)
      : new Date();

  date.setHours(6, 0, 0, 0);
  const minDate = new Date(1900, 0, 1, 6, 0, 0, 0);

  return date < minDate ? new Date() : date;
};

export function timestampMixin() {
  return {
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
  };
}
