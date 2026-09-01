import Image from "next/image";
import Link from "next/link";
import NavMenu from "../components/NavMenu";

export const metadata = {
  title: 'Posters - Everest Hack Club',
  description: 'Browse and download posters from Everest Hack Club events and campaigns',
};

// Get all posters from /poster folder
const posters = [
  '/poster/1.png',
  '/poster/2.png',
  '/poster/3.png',
  '/poster/4.png',
];

export default function PostersPage() {
  return (
    <div className="min-h-screen bg-grid">
      {/* Top Bar */}
      <Image
        src="/topbar-everest.svg"
        alt=""
        role="presentation"
        width={1920}
        height={80}
        className="h-auto w-full"
        priority
      />

      {/* Header */}
      <div className="bg-grid relative">
        <NavMenu />

        {/* Page Header */}
        <div className="px-6 sm:px-12 py-16 max-w-6xl mx-auto">
          <h1 className="text-6xl sm:text-7xl font-black text-[#473b47] mb-4">
            club
          </h1>
          <h1 className="text-6xl sm:text-7xl font-black text-[#e11d48] mb-6">
            posters
          </h1>
          <p className="text-xl text-[#473b47] max-w-2xl">
            Download and share our posters to spread the word about Everest Hack Club!
          </p>
        </div>
      </div>

      {/* Posters Grid - Simple image display */}
      <section className="px-6 sm:px-12 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-8">
            {posters.map((poster, index) => (
              <div
                key={index}
                className="bg-white border-4 border-[#473b47] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {/* Poster Image */}
                <div className="relative aspect-[3/4] bg-gradient-to-br from-[#c3e6f3] to-[#abc8f4]">
                  <Image
                    src={poster}
                    alt={`Poster ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-12 py-8 bg-white border-t-4 border-[#1F2D3D] text-center pointer-events-auto">
        <p className="text-[#1F2D3D] font-medium">
          © 2026 Everest Hack Club • <Link href="/" className="text-[#EC3750] hover:underline">Back to Home</Link>
        </p>
      </footer>
    </div>
  );
}
