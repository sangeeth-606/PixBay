import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Avoid accessing deprecated properties directly
// No use of mozInputSource here

export function isVirtualEvent(event: MouseEvent | PointerEvent): boolean {
  if ("pointerType" in event) {
    return !event.pointerType;
  }

  if ("isTrusted" in event) {
    return !event.isTrusted;
  }

  return false;
}
