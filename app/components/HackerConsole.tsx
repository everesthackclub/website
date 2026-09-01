"use client";

import { useState, useRef, useEffect } from "react";
import { JOIN_URL } from "../lib/site";

export default function HackerConsole() {
  const [history, setHistory] = useState<string[]>([
    "// Welcome to Everest Hack Club Terminal v1.0.0",
    "// Type 'help' to see available commands.",
    "",
  ]);
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let response: string[] = [];

    switch (trimmed) {
      case "help":
        response = [
          `> ${cmd}`,
          "Available commands:",
          "  about    - What is Everest Hack Club?",
          "  events   - What activities do we host?",
          "  join     - Get the invitation link to join us",
          "  clear    - Clear the terminal screen",
        ];
        break;
      case "about":
        response = [
          `> ${cmd}`,
          "Everest Hack Club is a student-run programming & makers community based in Biratnagar, Nepal.",
          "We focus on creating real-world projects, hosting hackathons, and teaching software creation from scratch.",
        ];
        break;
      case "events":
        response = [
          `> ${cmd}`,
          "Current event: 'EHC Launch & Intro Session' [Status: Planning]",
          "Type 'join' to get plugged into our chats and stay tuned for the venue details!",
        ];
        break;
      case "join":
        response = [
          `> ${cmd}`,
          "Opening join portal...",
          `Redirect URL: ${JOIN_URL}`,
          "Please visit our registration page by clicking 'Join the Club' on the left pane!",
        ];
        // Open link safely in new tab
        if (typeof window !== "undefined") {
          window.open(JOIN_URL, "_blank");
        }
        break;
      case "clear":
        setHistory([]);
        return;
      case "":
        response = [">"];
        break;
      default:
        response = [
          `> ${cmd}`,
          `Command '${trimmed}' not found. Type 'help' for options.`,
        ];
    }

    setHistory((prev) => [...prev, ...response, ""]);
  };

  return (
    <div className="w-full rounded-2xl border-2 border-[var(--border-dark)] bg-[var(--surface-code)] text-green-400 font-mono shadow-retro overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b-2 border-[var(--border-dark)] bg-[var(--surface-2)] dark:bg-[#121214] text-xs font-semibold text-[var(--text-secondary)] select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-[var(--border-dark)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 border border-[var(--border-dark)]" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-[var(--border-dark)]" />
        </div>
        <span className="text-[var(--text-primary)] font-hacker-mono">guest@ehc:~</span>
        <div className="w-8" />
      </div>

      {/* Output screen */}
      <div
        ref={containerRef}
        className="p-5 h-[280px] overflow-y-auto text-xs leading-relaxed flex flex-col gap-1.5 selection:bg-green-500 selection:text-black"
      >
        {history.map((line, i) => (
          <div key={i} className={line.startsWith(">") ? "text-white font-semibold" : ""}>
            {line}
          </div>
        ))}

        {/* Input line */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCommand(input);
            setInput("");
          }}
          className="flex items-center gap-1 text-white"
        >
          <span className="text-green-500 font-bold">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none font-mono text-xs focus:ring-0 text-white p-0"
            placeholder="type 'help' here..."
            autoFocus
            aria-label="Terminal input prompt"
          />
        </form>
      </div>
    </div>
  );
}
