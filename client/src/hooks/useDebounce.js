import { useState, useEffect } from "react";

// Delays updating the returned value until the input has stopped changing for `delay` ms.
// Used to avoid firing a search API call on every single keystroke.
export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If value changes again before the timer fires, cancel the previous timer —
    // this is what makes it "debounce" rather than just "delay"
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};