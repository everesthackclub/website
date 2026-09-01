"use client";

import { useEffect } from "react";
import { JOIN_URL, DISCORD_URL } from "../lib/site";

/**
 * Global keyboard shortcuts:
 *   A → Join the Club (opens Hack Club join page)
 *   X → Join Discord
 *   C → Contact page
 */
export default function KeyboardShortcuts() {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Ignore when user is typing in an input / textarea / contenteditable
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key.toLowerCase()) {
        case "a":
          window.open(JOIN_URL, "_blank", "noopener,noreferrer");
          break;
        case "x":
          window.open(DISCORD_URL, "_blank", "noopener,noreferrer");
          break;
        case "c":
          window.location.href = "/contact";
          break;
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return null;
}
