async function checkConnection(): Promise<{ ok: boolean; message: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return { ok: false, message: 'Environment variables not set' }
  }

  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: key },
      cache: 'no-store',
    })
    if (res.ok) {
      return { ok: true, message: 'Connected' }
    }
    return { ok: false, message: `HTTP ${res.status} — check your keys` }
  } catch {
    return { ok: false, message: 'Network error — check SUPABASE_URL' }
  }
}

export default async function Home() {
  const status = await checkConnection()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white text-black">
      <h1 className="text-2xl font-semibold tracking-tight">factsfordebate</h1>
      <p className="text-sm text-zinc-500">Foundation check</p>
      <span
        className={`rounded-full px-4 py-1 text-sm font-medium ${
          status.ok
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-700'
        }`}
      >
        Supabase: {status.message}
      </span>
    </main>
  )
}
