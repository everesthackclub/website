import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-20 md:py-32">
        <div className="max-w-4xl w-full text-center">
          {/* Flag Icon */}
          <div className="flex justify-center mb-8">
            <Image
              src="/Image/flag-orpheus-top.svg"
              alt="Hack Club Flag"
              width={120}
              height={120}
              priority
              className="animate-pulse"
            />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 tracking-tight">
            Welcome to{" "}
            <span className="text-red-600">Hack Club</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-2xl mx-auto">
            A community of high school hackers building amazing projects and learning together.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://hackclub.com/slack"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-red-600 text-white rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              Join Our Slack
            </a>
            <a
              href="https://hackclub.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-red-600 border-2 border-red-600 rounded-lg font-semibold text-lg hover:bg-red-50 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          <div className="p-8 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-black mb-2">Build Projects</h3>
            <p className="text-gray-600">
              Create real things that matter. From websites to hardware hacks.
            </p>
          </div>

          <div className="p-8 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-black mb-2">Join Community</h3>
            <p className="text-gray-600">
              Connect with thousands of teenage makers from around the world.
            </p>
          </div>

          <div className="p-8 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-bold text-black mb-2">Learn Together</h3>
            <p className="text-gray-600">
              Share knowledge, get help, and grow your skills with peers.
            </p>
          </div>
        </div>

        {/* Footer Icon */}
        <div className="mt-20">
          <Image
            src="/Image/icon-rounded.svg"
            alt="Hack Club Icon"
            width={60}
            height={60}
            className="opacity-50 hover:opacity-100 transition-opacity"
          />
        </div>
      </main>
    </div>
  );
}
