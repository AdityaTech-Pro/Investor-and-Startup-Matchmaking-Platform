import React from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { ThreeAnimation } from '../components/ThreeAnimation'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white flex flex-col">
      {/* Animation Background Layer */}
      <ThreeAnimation />
      
      {/* Static Background Layer */}
      <div className="absolute inset-0 bg-[url('/src/assets/bgImage.svg')] bg-repeat-y bg-cover bg-center blur-sm brightness-75"></div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 w-full">
        {/* Navbar */}
        <header className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">Chatiao</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => navigate('/login')}
              className="hover:text-purple-300 cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-purple-500 to-violet-600 px-4 py-2 rounded-md text-white cursor-pointer"
            >
              Get Started
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-24 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Connecting Innovative Startups <br /> with Visionary Investors
          </h1>
          <p className="mt-6 text-gray-300 text-lg">
            Discover funding opportunities or invest in groundbreaking ideas
            through our intelligent matchmaking platform.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-3 rounded-md font-medium"
            >
              Join Now
            </button>
            <button
              onClick={() => navigate('/login')}
              className="border border-gray-400 px-6 py-3 rounded-md font-medium"
            >
              Login
            </button>
            <a
              href="#contact"
              className="border border-purple-500 text-purple-300 px-6 py-3 rounded-md font-medium hover:bg-purple-500 hover:text-white transition"
            >
              Contact
            </a>
          </div>
        </section>

        {/* Impact Numbers */}
        <section className="px-4 py-20 flex justify-center bg-black/60">
          <div className="max-w-6xl w-full text-center">
            <h2 className="text-3xl font-bold mb-10">Our Impact</h2>
            <div className="grid sm:grid-cols-4 gap-8">
              <div>
                <p className="text-4xl font-bold text-purple-400">500+</p>
                <p className="text-sm text-gray-300">Startups Registered</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-purple-400">200+</p>
                <p className="text-sm text-gray-300">Active Investors</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-purple-400">90%</p>
                <p className="text-sm text-gray-300">Success Match Rate</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-purple-400">50+</p>
                <p className="text-sm text-gray-300">Sectors Covered</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI-based Investor & Startup Previous Meet Section */}
        <section className="flex flex-col items-center justify-center py-12 px-4 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">AI-Powered Investor & Startup Connections</h2>
          <p className="text-gray-300 text-center mb-6 max-w-2xl">
            Our platform has already facilitated impactful meetings between visionary investors and innovative startups. Here’s a glimpse of how AI brings people together for the future of Entrepreneurship.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center justify-center w-full">
            <div className="flex flex-col items-center">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                alt="AI-based Investor and Startup Meeting"
                className="rounded-lg shadow-lg w-full max-w-xs border-4 border-purple-500"
                style={{objectFit: 'cover', height: '220px'}}
              />
              <span className="text-xs text-gray-400 mt-2">Investor and Startup handshake (AI-generated)</span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://img.freepik.com/premium-photo/diverse-business-team-collaborating-modern-office_875825-52442.jpg"
                alt="Startup Team Collaboration"
                className="rounded-lg shadow-lg w-full max-w-xs border-4 border-purple-500"
                style={{objectFit: 'cover', height: '220px'}}
              />
              <span className="text-xs text-gray-400 mt-2">Startup team collaborating with investor </span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
                alt="Pitch Presentation"
                className="rounded-lg shadow-lg w-full max-w-xs border-4 border-purple-500"
                style={{objectFit: 'cover', height: '220px'}}
              />
              <span className="text-xs text-gray-400 mt-2">Pitching ideas to investors</span>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=800&q=80"
                alt="Investor Discussion"
                className="rounded-lg shadow-lg w-full max-w-xs border-4 border-purple-500"
                style={{objectFit: 'cover', height: '220px'}}
              />
              <span className="text-xs text-gray-400 mt-2">Investors discussing with startup founders </span>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="px-4 py-20 flex justify-center bg-black/50"
        >
          <div className="max-w-5xl w-full text-center">
            <h2 className="text-3xl font-bold mb-6">How Chatiao Works</h2>
            <div className="grid sm:grid-cols-3 gap-8 text-left">
              <div className="bg-white/10 p-6 rounded-lg border border-gray-500">
                <h3 className="text-xl font-semibold mb-2">
                  1. Create Your Profile
                </h3>
                <p className="text-gray-300 text-sm">
                  Startups and Investors sign up and build detailed profiles,
                  including sectors, funding needs, or investment interests.
                </p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg border border-gray-500">
                <h3 className="text-xl font-semibold mb-2">
                  2. AI Matchmaking
                </h3>
                <p className="text-gray-300 text-sm">
                  Our AI recommends best-fit matches based on preferences,
                  industry verticals, and funding stages.
                </p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg border border-gray-500">
                <h3 className="text-xl font-semibold mb-2">
                  3. Connect & Grow
                </h3>
                <p className="text-gray-300 text-sm">
                  Connect through secure channels, schedule meetings, and begin
                  collaborative innovation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="px-4 py-20 flex justify-center">
          <div className="max-w-4xl w-full text-center">
            <h2 className="text-3xl font-bold mb-4">About Us</h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              Our platform bridges the gap between visionaries with brilliant startup ideas and investors
              who are looking to fund the next big innovation. With an intuitive AI-based matchmaking system,
              Chatiao personalizes connections and accelerates the startup journey.
            </p>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="px-4 py-20 flex justify-center">
          <div className="max-w-6xl w-full">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Latest from Our Blog
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white/10 p-4 rounded-lg border border-gray-500">
                <h3 className="text-lg font-semibold mb-2">
                  Why AI is Changing the Funding Game
                </h3>
                <p className="text-gray-300 text-sm">
                  Explore how artificial intelligence is transforming
                  early-stage startup investment with precision matchmaking.
                </p>
                <a
                  href="#"
                  className="text-purple-300 text-sm hover:underline mt-2 block"
                >
                  Read more →
                </a>
              </div>
              <div className="bg-white/10 p-4 rounded-lg border border-gray-500">
                <h3 className="text-lg font-semibold mb-2">
                  Top 10 Sectors for 2025
                </h3>
                <p className="text-gray-300 text-sm">
                  From DeepTech to BioTech, find out which industries are
                  getting the most investor attention.
                </p>
                <a
                  href="#"
                  className="text-purple-300 text-sm hover:underline mt-2 block"
                >
                  Read more →
                </a>
              </div>
              <div className="bg-white/10 p-4 rounded-lg border border-gray-500">
                <h3 className="text-lg font-semibold mb-2">
                  Investor Tips for First-Time Founders
                </h3>
                <p className="text-gray-300 text-sm">
                  Avoid common pitfalls and make your pitch irresistible to
                  angel investors.
                </p>
                <a
                  href="#"
                  className="text-purple-300 text-sm hover:underline mt-2 block"
                >
                  Read more →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="px-4 py-20 flex justify-center">
          <div className="max-w-6xl w-full text-center">
            <h2 className="text-3xl font-bold mb-10">What People Say</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 p-6 rounded-lg border border-gray-500">
                <p className="text-md">🚀 "Chatiao helped me find investors in just weeks. It’s like magic!"</p>
                <p className="mt-4 font-semibold text-right">— Ananya, Startup Founder</p>
              </div>
              <div className="bg-white/10 p-6 rounded-lg border border-gray-500">
                <p className="text-md">💼 "Perfect for discovering promising startups aligned with my interests."</p>
                <p className="mt-4 font-semibold text-right">— Ravi, Angel Investor</p>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Logos */}
        <section className="px-4 py-16 flex justify-center bg-black/40">
          <div className="max-w-5xl w-full text-center">
            <h2 className="text-2xl font-bold mb-6">Trusted By</h2>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                className="h-10"
                alt="Microsoft"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                className="h-10"
                alt="Google"
              />
              <img
                src="https://tse2.mm.bing.net/th/id/OIP.p8sW7kW_Bvuq5bJCiWOPxQHaEK?pid=Api&P=0&h=180"
                className="h-10"
                alt="Sequoia"
              />
              <img
                src="https://tse1.mm.bing.net/th/id/OIP.0Cqtm6Fi2SsTyufbOCOJRwAAAA?pid=Api&P=0&h=180"
                className="h-10"
                alt="Y Combinator"
              />
            </div>
          </div>
        </section>

        <section id="contact" className="px-4 py-20 flex justify-center">
          <div className="max-w-3xl w-full text-center">
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 rounded bg-white/10 border border-gray-500 text-white focus:outline-none"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 rounded bg-white/10 border border-gray-500 text-white focus:outline-none"
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                className="w-full p-3 rounded bg-white/10 border border-gray-500 text-white focus:outline-none"
              />
              <button type="submit" className="bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-3 rounded-md">
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* Contact Team Section */}
        <section id="contact-team" className="px-4 py-20 flex justify-center bg-black/60">
          <div className="max-w-5xl w-full text-center">
            <h2 className="text-3xl font-bold mb-10">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
              <div className="bg-white/10 p-6 rounded-lg border border-gray-500 w-full max-w-xs">
                <img src="https://i.ibb.co/SXD8y4Sy/IMG-20250717-WA0017.jpg" alt="Aditya Verma" className="w-25 h-28 rounded-full mx-auto mb-4 border-2 border-purple-500" />
                <h3 className="text-xl font-semibold">Aditya Verma</h3>
                <p className="text-purple-300">Founder & Developer</p>
                <p className="text-gray-300 text-sm mt-2">Great Leader with Visionary Entrepreneur, Passionate about AI and Startups and 😎Here working as Backend Developer.</p>
                <a href="mailto:adityavermatech80@gmail.com" className="text-purple-400 hover:underline mt-2 block">✉ adityavermatech80@gmail.com</a>
                <a href="https://www.linkedin.com/in/aditya-verma-2a3915289/" className="text-purple-400 hover:underline mt-2 block">LinkedIn</a>
              </div>
              <div className="bg-white/10 p-6 rounded-lg border border-gray-500 w-full max-w-xs">
                <img src="" alt="Apeksha Singh" className="w-25 h-28 rounded-full mx-auto mb-4 border-2 border-purple-500" />
                <h3 className="text-xl font-semibold">Apeksha Singh</h3>
                <p className="text-purple-300">Founder & Developer</p>
                <p className="text-gray-300 text-sm mt-2">Tech visionary turning bold ideas into scalable products</p>
                <a href="mailto:shivanshmittalsde@gmail.com" className="text-purple-400 hover:underline mt-2 block">✉ </a>
                <a href=" " className="text-purple-400 hover:underline mt-2 block">LinkedIn</a>
              </div>
              <div className="bg-white/10 p-6 rounded-lg border border-gray-500 w-full max-w-xs">
                <img src="" alt="Khushboo" className="w-25 h-28 rounded-full mx-auto mb-4 border-2 border-purple-500" />
                <h3 className="text-xl font-semibold">Khushboo</h3>
                <p className="text-purple-300">Founder & Developer</p>
                <p className="text-gray-300 text-sm mt-2">Command, Creater, Conquer.</p>
                <a href="mailto:ksvijay2005@gmail.com" className="text-purple-400 hover:underline mt-2 block">✉ </a>
                <a href="" className="text-purple-400 hover:underline mt-2 block">LinkedIn</a>
              </div>
              <div className="bg-white/10 p-6 rounded-lg border border-gray-500 w-full max-w-xs">
                <img src="" alt="Deesha Jain" className="w-25 h-28 rounded-full mx-auto mb-4 border-2 border-purple-500" />
                <h3 className="text-xl font-semibold">Deesha Jain</h3>
                <p className="text-purple-300">Founder & Developer</p>
                <p className="text-gray-300 text-sm mt-2">Frontend developer with a passion for scalable systems.</p>
                <a href="mailto:rajdikshant07@gmail.com" className="text-purple-400 hover:underline mt-2 block">✉ </a>
                <a href="" className="text-purple-400 hover:underline mt-2 block">LinkedIn</a>
              </div>
              <div className="bg-white/10 p-6 rounded-lg border border-gray-500 w-full max-w-xs">
                <img src="/src/assets/Drishty01_image.jpg" alt="Drishty Yagyavalkya " className="w-25 h-28 rounded-full mx-auto mb-4 border-2 border-purple-500" />
                <h3 className="text-xl font-semibold">Drishty Yagyavalkya </h3>
                <p className="text-purple-300">Founder & Developer</p>
                <p className="text-gray-300 text-sm mt-2">Ideas, Code, Impact.</p>
                <a href="mailto:drishuusharma06@gmail.com" className="text-purple-400 hover:underline mt-2 block">✉ drishuusharma06@gmail.com </a>
                <a href="https://www.linkedin.com/in/drishty-yagyavalkya-b236732b8/" className="text-purple-400 hover:underline mt-2 block">LinkedIn</a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm py-6 bg-black/70 border-t border-gray-700 relative z-10">
        © {new Date().getFullYear()} Chatiao. All rights reserved.
      </footer>
    </div>
  )
}

export default LandingPage