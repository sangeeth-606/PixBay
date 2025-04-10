// Avoid accessing deprecated properties directly
// No use of mozInputSource here

export function isVirtualEvent(event: MouseEvent | PointerEvent): boolean {
    if ('pointerType' in event) {
      return !event.pointerType;
    }
  
    if ('isTrusted' in event) {
      return !event.isTrusted;
    }
  
    return false;
  }
  