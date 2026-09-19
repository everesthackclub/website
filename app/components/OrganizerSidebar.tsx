"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ActiveEventInfo {
  name: string;
  isFormOpen: boolean;
}

export default function OrganizerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeEvent, setActiveEvent] = useState<ActiveEventInfo | null>(null);

  useEffect(() => {
    fetch("/api/organizer/events")
      .then((r) => r.json())
      .then((data) => {
        const active = data.events?.find((e: any) => e.isActive && !e.isCompleted);
        setActiveEvent(active ? { name: active.name, isFormOpen: active.isFormOpen } : null);
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/organizer/logout", { method: "POST" });
      router.push("/organizer/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path: string) => {
    if (path === "/organizer/events") {
      return pathname.startsWith("/organizer/events");
    }
    return pathname === path;
  };

  const navItems = [
    {
      href: "/organizer/dashboard",
      label: "Dashboard",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      href: "/organizer/events",
      label: "Events",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      href: "/organizer/hackers",
      label: "Hackers",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      href: "/organizer/scan",
      label: "Scanner",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-[#e7e5e4]" style={{ minHeight: "100vh" }}>
      {/* Brand */}
      <div className="p-6 border-b border-[#e7e5e4]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#ec3750] rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-black text-[#1c1917] leading-tight">Everest HC</h2>
            <p className="text-xs text-[#78716c] font-medium">Organizer Panel</p>
          </div>
        </div>
      </div>

      {/* Active Event Pill */}
      {activeEvent && (
        <div className="mx-4 mt-4 px-3 py-2 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
            <span className="text-xs font-bold text-green-700">Live Event</span>
            {!activeEvent.isFormOpen && (
              <span className="ml-auto text-xs font-bold text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded">
                Form closed
              </span>
            )}
          </div>
          <p className="text-xs text-green-800 font-semibold truncate pl-4">{activeEvent.name}</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 mt-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-150 text-sm ${
                active
                  ? "bg-[#ec3750] text-white font-bold shadow-sm"
                  : "text-[#57534e] hover:bg-[#f5f5f4] hover:text-[#1c1917]"
              }`}
            >
              <span className={active ? "opacity-100" : "opacity-60"}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#e7e5e4]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#78716c] hover:text-[#ec3750] hover:bg-red-50 font-medium transition-all rounded-xl"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
