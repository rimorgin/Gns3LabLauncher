import { useEffect } from "react";

type ModifierKeys = "ctrl" | "meta" | "shift" | "alt";

interface UseKeyDownOptions {
  key: string;
  modifiers?: ModifierKeys[];
  disabled?: boolean;
  allowRepeated?: boolean; // Whether to allow repeated triggers (e.g., holding the key)
}

/**
 * A custom hook to listen for specific keyboard shortcuts.
 *
 * @param options - Configuration for the keybinding
 * @param callback - Function to run when the key combination is pressed
 */
export function useKeyDown(
  options: UseKeyDownOptions,
  callback: (event: KeyboardEvent) => void
) {
  const { key, modifiers = [], disabled = false, allowRepeated = false } = options;

  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const hasCtrl = modifiers.includes("ctrl") ? event.ctrlKey : true;
      const hasMeta = modifiers.includes("meta") ? event.metaKey : true;
      const hasShift = modifiers.includes("shift") ? event.shiftKey : true;
      const hasAlt = modifiers.includes("alt") ? event.altKey : true;

      const matchesModifiers =
        hasCtrl && hasMeta && hasShift && hasAlt;

      const matchesKey = event.key.toLowerCase() === key.toLowerCase();

      if (matchesKey && matchesModifiers) {
        if (!allowRepeated && event.repeat) return;

        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [key, modifiers, disabled, allowRepeated, callback]);
}