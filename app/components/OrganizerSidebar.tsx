"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function OrganizerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-[#e7e5e4]">
      <div className="p-6 border-b border-[#e7e5e4]">
        <h2 className="text-2xl font-black text-[#1c1917]">Everest HC</h2>
        <p className="text-sm text-[#57534e] mt-1">Organizer</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <Link 
          href="/organizer/dashboard" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive("/organizer/dashboard")
              ? "bg-[#ec3750] text-white font-bold"
              : "text-[#57534e] hover:bg-[#f5f5f4]"
          }`}
        >
          Dashboard
        </Link>
        <Link 
          href="/organizer/hackers" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive("/organizer/hackers")
              ? "bg-[#ec3750] text-white font-bold"
              : "text-[#57534e] hover:bg-[#f5f5f4]"
          }`}
        >
          Hackers
        </Link>
        <Link 
          href="/organizer/events" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive("/organizer/events")
              ? "bg-[#ec3750] text-white font-bold"
              : "text-[#57534e] hover:bg-[#f5f5f4]"
          }`}
        >
          Events
        </Link>
        <Link 
          href="/organizer/scan" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
            isActive("/organizer/scan")
              ? "bg-[#ec3750] text-white font-bold"
              : "text-[#57534e] hover:bg-[#f5f5f4]"
          }`}
        >
          Scanner
        </Link>
      </nav>

      <div className="p-4 border-t border-[#e7e5e4]">
        <button 
          onClick={handleLogout} 
          className="w-full px-4 py-2 text-sm text-[#57534e] hover:text-[#ec3750] font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
