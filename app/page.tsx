export default function Home() {
  return (
    <main className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-5xl font-extrabold mb-6">Welcome to DormExchange</h1>
      <p className="mb-8 max-w-xl">
        DormExchange is the campus marketplace for textbooks, tech, and dorm essentials.
        Buy and sell with fellow students in a safe and easy way.
      </p>
      <a
        href="/campus"
        className="px-6 py-3 bg-yellow-400 text-black rounded-xl font-semibold"
      >
        Choose your campus
      </a>
    </main>
  )
}
