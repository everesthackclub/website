import Image from "next/image";
import Link from "next/link";
import SocialLinks from "./components/SocialLinks";
import DraggableSticker from "./components/DraggableSticker";
import Carousel from "./components/Carousel";
import { MailIcon } from "./components/icons";
import HomeNav from "./components/HomeNav";
import {
  JOIN_URL,
  WHATSAPP_URL,
  DISCORD_URL,
  CONTACT_EMAIL,
  FAQS,
} from "./lib/site";

const groupPhotos = [
  '/group/group1.webp',
  '/group/group4.jpeg',
  '/group/group5.jpeg',
];

export default function Home() {
  return (
    <div className="min-h-screen bg-grid pointer-events-none">
      {/* Cool Top Bar */}
      <Image
        src="/topbar-everest.svg"
        alt=""
        role="presentation"
        width={1920}
        height={80}
        className="h-auto w-full pointer-events-auto"
        priority
      />
      
      {/* Hero Section */}
      <div className="bg-grid relative pointer-events-none">
        <HomeNav />
        
        {/* Hero Content with Stickers */}
        <div className="relative flex w-full justify-center gap-x-8 gap-y-12 overflow-x-clip p-12 max-lg:flex-col max-lg:items-center sm:p-16 pointer-events-none">
          
          {/* 6 stickers total - sides only, no center */}
          {/* Top corners - 2 stickers */}
          <div className="absolute top-4 right-12 lg:right-20 z-10 max-sm:hidden">
            <DraggableSticker src="/Stickers/classic/hack-camp.png" alt="" width={120} shadow className="-rotate-6" />
          </div>
          <div className="absolute top-8 left-12 lg:left-20 z-10 max-sm:hidden">
            <DraggableSticker src="/Stickers/classic/arcade.png" alt="" width={115} shadow className="rotate-5" />
          </div>
          
          {/* Middle sides - 2 stickers (below the top ones) */}
          <div className="absolute top-48 right-8 lg:right-16 z-10 max-md:hidden">
            <DraggableSticker src="/Stickers/classic/orphmoji-yippee.png" alt="" width={95} shadow className="rotate-12" />
          </div>
          <div className="absolute top-52 left-8 lg:left-16 z-10 max-md:hidden">
            <DraggableSticker src="/Stickers/classic/epoch.png" alt="" width={90} shadow className="-rotate-8" />
          </div>
          
          {/* Lower sides - 2 more stickers (below middle ones) */}
          <div className="absolute bottom-12 right-8 lg:right-16 z-10 max-lg:hidden">
            <DraggableSticker src="/Stickers/classic/sledding.png" alt="" width={100} shadow className="rotate-6" />
          </div>
          <div className="absolute bottom-16 left-8 lg:left-16 z-10 max-lg:hidden">
            <DraggableSticker src="/Stickers/classic/game-lab.png" alt="" width={105} shadow className="-rotate-7" />
          </div>

          {/* Main Content */}
          <div className="flex min-w-0 flex-1 flex-col justify-center items-center text-center pointer-events-auto">
            <div className="relative w-fit opacity-100 mb-8">
              <h1 className="text-7xl sm:text-8xl font-black tracking-tight text-[#473b47]">
                everest
              </h1>
              <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-[#e11d48]">
                hack club
              </h1>
            </div>
            
            <p className="font-bold text-2xl sm:text-3xl text-[#473b47] max-w-2xl mb-8">
              A community of student hackers building awesome projects. By teenagers, for teenagers.
            </p>
            
            <div className="mt-8 flex gap-4 justify-center">
              <div className="flex-none">
                <a
                  href={JOIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative isolate flex h-12 items-center px-5 font-bold text-xl text-white outline-offset-2 outline-[#5167dd] transition bg-[#5e6fe5] hover:scale-105 focus:scale-105 focus:outline-2 active:scale-100 rounded-full"
                >
                  <span className="mr-2 grid size-6 place-items-center rounded-full bg-white text-sm text-[#5e6fe5] uppercase">a</span>
                  join the club
                </a>
              </div>
              <div className="flex-none">
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative isolate flex h-12 items-center px-5 font-bold text-xl text-white outline-offset-2 outline-[#70c9bb] transition bg-[#65c3b5] hover:scale-105 focus:scale-105 focus:outline-2 active:scale-100 rounded-full"
                >
                  <span className="mr-2 grid size-6 place-items-center rounded-full bg-white text-sm text-[#65c3b5] uppercase">x</span>
                  join discord
                </a>
              </div>
            </div>
            
            <p className="mt-4 text-base text-neutral-500">
              or scroll down to discover more!
            </p>
          </div>
        </div>

        {/* Carousel Section with Label */}
        <div className="relative overflow-x-clip bg-gradient-to-t from-white pt-8 pb-12 pointer-events-auto">
          <div className="absolute top-4 left-8 z-10">
            <p className="text-sm font-bold text-[#473b47] opacity-60 uppercase tracking-wider">
              at hack club
            </p>
          </div>
          <Carousel images={groupPhotos} />
        </div>
      </div>

      {/* Info Section with Stickers */}
      <section className="relative px-6 sm:px-12 py-20 bg-white">
        {/* More Stickers */}
        <div className="absolute top-12 -left-4 z-10">
          <DraggableSticker src="/Stickers/classic/burst.png" alt="" width={144} shadow className="rotate-2" />
        </div>
        <div className="absolute top-48 -right-2 z-10 max-md:hidden">
          <DraggableSticker src="/Stickers/classic/valorant.png" alt="" width={144} shadow className="-rotate-6" />
        </div>
        <div className="absolute bottom-20 left-8 z-10 max-md:hidden">
          <DraggableSticker src="/Stickers/classic/orpheus-boba.png" alt="" width={96} shadow className="rotate-3" />
        </div>
        <div className="absolute bottom-12 right-8 z-10 max-md:hidden">
          <DraggableSticker src="/Stickers/classic/jetlag.png" alt="" width={128} shadow className="-rotate-3" />
        </div>

        <div className="max-w-6xl mx-auto pointer-events-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-black text-[#473b47] mb-6">
              what we do
            </h2>
            <p className="text-xl text-[#473b47] max-w-2xl mx-auto">
              No lectures, no tests, just building cool stuff.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border-4 border-[#473b47] p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-black text-[#473b47] mb-3">build projects</h3>
              <p className="text-[#473b47] leading-relaxed">
                Make websites, games, robots, and tools. Learn by doing, not by reading textbooks.
              </p>
            </div>

            <div className="bg-white border-4 border-[#473b47] p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-black text-[#473b47] mb-3">hack together</h3>
              <p className="text-[#473b47] leading-relaxed">
                Weekly meetups in Biratnagar to code, share ideas, and help each other out.
              </p>
            </div>

            <div className="bg-white border-4 border-[#473b47] p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-black text-[#473b47] mb-3">ship & share</h3>
              <p className="text-[#473b47] leading-relaxed">
                Show your work to the world. Get grants, win prizes, connect with global hackers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Ladder/Steps Style */}
      <section className="relative px-6 sm:px-12 py-20 bg-gradient-to-br from-[#c3e6f3] to-[#abc8f4]">
        {/* Stickers */}
        <div className="absolute -top-4 left-8 z-10 max-md:hidden">
          <DraggableSticker src="/Stickers/classic/hack-to-the-future.png" alt="" width={120} shadow className="-rotate-6" />
        </div>
        <div className="absolute -bottom-6 right-12 z-10 max-md:hidden">
          <DraggableSticker src="/Stickers/classic/ship.png" alt="" width={110} shadow className="rotate-4" />
        </div>

        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-black text-[#473b47] mb-4">
              how it works
            </h2>
            <p className="text-xl text-[#473b47]">
              Join our community and start shipping.
            </p>
          </div>

          {/* Ladder-style steps going down */}
          <div className="flex flex-col gap-8">
            {/* Step 1 - Left */}
            <div className="self-start w-full max-w-md">
              <div className="aspect-[461/289] relative rotate-3 shadow-xl">
                <Image
                  src="/postcard1.png"
                  alt=""
                  width={461}
                  height={289}
                  className="absolute inset-0 size-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 bg-[#5e6fe5] rounded-full flex items-center justify-center text-white font-black text-3xl mb-4 shadow-lg border-4 border-white">
                    1
                  </div>
                  <h3 className="text-3xl font-black text-[#1F2D3D] mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                    submit your project
                  </h3>
                  <p className="text-[#1F2D3D] text-lg font-bold">
                    Share what you&apos;ve built
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 - Right */}
            <div className="self-end w-full max-w-md">
              <div className="aspect-[461/289] relative -rotate-2 shadow-xl">
                <Image
                  src="/postcard2.png"
                  alt=""
                  width={461}
                  height={289}
                  className="absolute inset-0 size-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 bg-[#65c3b5] rounded-full flex items-center justify-center text-white font-black text-3xl mb-4 shadow-lg border-4 border-white">
                    2
                  </div>
                  <h3 className="text-3xl font-black text-[#1F2D3D] mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                    get reviewed
                  </h3>
                  <p className="text-[#1F2D3D] text-lg font-bold">
                    Receive feedback
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 - Left */}
            <div className="self-start w-full max-w-md">
              <div className="aspect-[461/289] relative rotate-2 shadow-xl">
                <Image
                  src="/postcard3.png"
                  alt=""
                  width={461}
                  height={289}
                  className="absolute inset-0 size-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 bg-[#ffa599] rounded-full flex items-center justify-center text-white font-black text-3xl mb-4 shadow-lg border-4 border-white">
                    3
                  </div>
                  <h3 className="text-3xl font-black text-[#1F2D3D] mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                    earn your reward
                  </h3>
                  <p className="text-[#1F2D3D] text-lg font-bold">
                    Get grants & swag
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 - Right */}
            <div className="self-end w-full max-w-md">
              <div className="aspect-[461/289] relative -rotate-1 shadow-xl">
                <Image
                  src="/postcard4.png"
                  alt=""
                  width={461}
                  height={289}
                  className="absolute inset-0 size-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 bg-[#e11d48] rounded-full flex items-center justify-center text-white font-black text-3xl mb-4 shadow-lg border-4 border-white">
                    4
                  </div>
                  <h3 className="text-3xl font-black text-[#1F2D3D] mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                    enjoy & repeat
                  </h3>
                  <p className="text-[#1F2D3D] text-lg font-bold">
                    Build your next project
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative px-6 sm:px-12 py-16 bg-[#E8F3FF] pointer-events-auto">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl sm:text-6xl font-black text-[#1F2D3D] mb-4">
              questions?
            </h2>
          </div>

          <div className="space-y-4 pointer-events-auto">
            {FAQS.map((faq, index) => (
              <details
                key={index}
                className="group bg-white border-4 border-[#1F2D3D] rounded-2xl shadow-[6px_6px_0px_0px_#1F2D3D] overflow-hidden pointer-events-auto cursor-pointer"
              >
                <summary className="cursor-pointer p-6 font-bold text-lg text-[#1F2D3D] hover:bg-[#F7FAFC] transition-colors flex justify-between items-center pointer-events-auto">
                  <span>{faq.q}</span>
                  <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6 text-[#1F2D3D] leading-relaxed border-t-4 border-[#E8F3FF]">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 sm:px-12 py-16 bg-white border-t-4 border-[#1F2D3D] pointer-events-auto">
        <div className="max-w-6xl mx-auto pointer-events-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Col 1 */}
            <div className="pointer-events-auto">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/Image/logo2.svg" alt="Everest HC" width={40} height={40} />
                <span className="font-black text-xl text-[#1F2D3D]">Everest HC</span>
              </div>
              <p className="text-[#1F2D3D] leading-relaxed mb-4">
                A student-led, official chapter of Hack Club in Biratnagar, Nepal.
              </p>
              <div className="flex items-center gap-2">
                <Image src="/Image/flag-standalone.svg" alt="Hack Club" width={24} height={24} />
                <span className="text-sm text-[#1F2D3D] font-medium">Official Hack Club Chapter</span>
              </div>
            </div>

            {/* Col 2 */}
            <div className="pointer-events-auto">
              <h3 className="font-black text-lg text-[#1F2D3D] mb-4">Contact</h3>
              <ul className="space-y-2 text-[#1F2D3D]">
                <li>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="hover:text-[#EC3750] transition-colors flex items-center gap-2 pointer-events-auto"
                  >
                    <MailIcon className="w-4 h-4" />
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li>Biratnagar, Nepal 🇳🇵</li>
                <li>
                  <Link href="/contact" className="text-[#EC3750] font-bold hover:underline pointer-events-auto">
                    Get in touch →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="pointer-events-auto">
              <h3 className="font-black text-lg text-[#1F2D3D] mb-4">Community</h3>
              <SocialLinks />
            </div>
          </div>

          <div className="pt-8 border-t-4 border-[#E8F3FF] text-center">
            <p className="text-[#1F2D3D] font-medium">
              © 2026 Everest Hack Club • Built with ❤️ by teenagers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
