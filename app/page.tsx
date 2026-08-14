import Image from "next/image";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />

      {/* Dotted Background Pattern */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
      
      {/* Grid Lines Background */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] [background-size:64px_64px] opacity-30" />

      {/* Gradient Orbs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-red-100 rounded-full blur-3xl opacity-20 -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-20 -z-10" />

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Biratnagar, Nepal
              </div>

              {/* Main Heading */}
              <h1 className="text-6xl md:text-7xl font-bold text-black mb-6 tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                  Everest
                </span>
                <br />
                Hack Club
              </h1>

              {/* Tagline */}
              <p className="text-3xl md:text-4xl text-gray-800 mb-4 font-bold">
                Build. Break. Learn.
              </p>

              {/* Subheading */}
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                A student-led community where young makers build projects, experiment with code, and learn together.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/9779709154661"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-8 py-4 bg-black text-white rounded-full font-semibold text-lg hover:bg-gray-900 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  Join Us Now
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
                <a
                  href="#about"
                  className="px-8 py-4 bg-white text-black border border-gray-300 rounded-full font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative aspect-square">
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-blue-100 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>
                
                {/* Main Flag */}
                <div className="relative z-10 flex items-center justify-center h-full animate-[float_3s_ease-in-out_infinite]">
                  <Image
                    src="/Image/flag-orpheus-top.svg"
                    alt="Hack Club Flag"
                    width={280}
                    height={280}
                    priority
                    className="drop-shadow-2xl"
                  />
                </div>

                {/* Floating Elements */}
                <div className="absolute top-10 right-10 w-16 h-16 bg-red-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🚀</div>
              <h3 className="text-2xl font-bold text-black mb-2">Build</h3>
              <p className="text-gray-600 leading-relaxed">
                Create real projects that matter. From web apps to hardware hacks.
              </p>
            </div>

            <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🔧</div>
              <h3 className="text-2xl font-bold text-black mb-2">Break</h3>
              <p className="text-gray-600 leading-relaxed">
                Experiment fearlessly. Learn by taking things apart and rebuilding.
              </p>
            </div>

            <div className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💡</div>
              <h3 className="text-2xl font-bold text-black mb-2">Learn</h3>
              <p className="text-gray-600 leading-relaxed">
                Grow together with peers who share your passion for technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative px-6 py-24 md:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              What We Do
            </h2>
            <div className="w-16 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Everest Hack Club is a student-led community where young creators come together to build, experiment, and learn.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Whether you're coding your first website or building complex projects, we provide the space, resources, and community to help you grow.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                No experience required—just bring your curiosity and passion to create.
              </p>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-red-50 to-blue-50 rounded-3xl border border-gray-200 flex items-center justify-center">
                <Image
                  src="/Image/flag-standalone.svg"
                  alt="Hack Club"
                  width={200}
                  height={200}
                  className="opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative px-6 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Questions?
            </h2>
            <div className="w-16 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6">
            <details className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all">
              <summary className="cursor-pointer text-lg font-semibold text-black list-none flex justify-between items-center">
                Who can join Everest Hack Club?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Any student passionate about technology, coding, and building projects! No prior experience is required—just bring your enthusiasm to learn.
              </p>
            </details>

            <details className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all">
              <summary className="cursor-pointer text-lg font-semibold text-black list-none flex justify-between items-center">
                Do I need to know how to code?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Not at all! We welcome complete beginners. You'll learn by doing and get support from fellow members along the way.
              </p>
            </details>

            <details className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all">
              <summary className="cursor-pointer text-lg font-semibold text-black list-none flex justify-between items-center">
                What kind of projects do we build?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Anything you can imagine! Websites, apps, games, hardware projects, art installations—if you can dream it, we'll help you build it.
              </p>
            </details>

            <details className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all">
              <summary className="cursor-pointer text-lg font-semibold text-black list-none flex justify-between items-center">
                How do I get started?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Click the "Join Us" button to get in touch via WhatsApp. We'll guide you through the next steps!
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/Image/icon-rounded.svg"
              alt="Hack Club Icon"
              width={40}
              height={40}
              className="opacity-80"
            />
            <span className="font-semibold text-gray-700">Everest Hack Club</span>
          </div>
          
          <p className="text-gray-500 text-sm">
            Biratnagar, Nepal • Building the future together
          </p>
          
          <p className="text-gray-400 text-sm">
            © 2026 Everest Hack Club
          </p>
        </div>
      </footer>
    </div>
  );
}
