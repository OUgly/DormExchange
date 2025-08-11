'use client'
// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-panel">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-10 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <div className="font-bold text-lg">DormExchange</div>
          <p className="text-neutral-400 mt-3">
            The campus marketplace for textbooks, tech, and dorm essentials.
          </p>
        </div>

        <div>
          <div className="font-semibold mb-3">Product</div>
          <ul className="space-y-2 text-neutral-300">
            <li><a href="/">Browse Listings</a></li>
            <li><a href="/listings/new">Post a Listing</a></li>
            <li><a href="/messages">Messages</a></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-3">Company</div>
          <ul className="space-y-2 text-neutral-300">
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/careers">Careers</a></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold mb-3">Stay in the loop</div>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 bg-muted text-white placeholder:text-neutral-400 border border-line rounded-xl h-10 px-3 focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <button className="bg-accent hover:bg-accent/90 text-white rounded-xl px-4">Subscribe</button>
          </form>
          <div className="mt-3 text-neutral-500">We’ll only send important updates.</div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-4 text-xs flex items-center justify-between text-neutral-400">
          <div>© {new Date().getFullYear()} DormExchange. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
