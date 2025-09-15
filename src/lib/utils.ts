import clsx from "clsx";
import { twMerge } from "tailwind-merge";

// Define ClassValue manually
type ClassValue =
  | string
  | number
  | ClassValue[]
  | Record<string, any>
  | null
  | undefined
  | boolean;

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
