export default function Home() {
  return (
    <main className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-6 text-4xl font-bold">Welcome to DormExchange</h1>
      <p className="mb-8 max-w-xl opacity-90">
        DormExchange is the campus marketplace where students can buy and sell
        textbooks, furniture and everything in between with classmates.
      </p>
      <a
        href="/campus"
        className="inline-block rounded-xl bg-yellow-400 px-6 py-3 font-medium text-black"
      >
        Choose your campus
      </a>
    </main>
  )
}
