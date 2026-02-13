import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  // Filter out undefined, null, and empty strings
  const filteredInputs = inputs.filter(input => 
    input !== undefined && 
    input !== null && 
    input !== ''
  );
  return twMerge(clsx(filteredInputs));
}
