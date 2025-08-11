export default function Home() {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6">Welcome to DormExchange</h1>
      <p className="mb-4">Buy and sell items with other students.</p>
      <a
        href="/campus"
        className="inline-block px-4 py-2 bg-yellow-400 text-black rounded-xl"
      >
        Choose your campus
      </a>
    </main>
  )
}
