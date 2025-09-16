import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// Define ClassValue manually
type ClassValue =
  | string
  | number
  | ClassValue[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Record<string, any>
  | null
  | undefined
  | boolean;

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
