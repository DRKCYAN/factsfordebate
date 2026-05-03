'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createStat, updateStat, deleteStat, toggleStatPublished } from '@/app/admin/_actions/stats'
import type { Stat, SubMotion } from '@/lib/types'

type SubMotionWithTopic = SubMotion & { topics: { name: string } }
type StatWithRelations = Stat & { sub_motions: { title: string; topics: { name: string } } }

interface Props {
  stats: StatWithRelations[]
  subMotions: SubMotionWithTopic[]
}

const blankForm = {
  sub_motion_id: '',
  side: 'pro' as 'pro' | 'con' | 'neutral',
  type: 'text' as 'text' | 'iframe',
  stat_text: '',
  context: '',
  source_name: '',
  source_url: '',
  source_year: '',
  iframe_url: '',
  published: false,
}

const sideBadge: Record<string, string> = {
  pro: 'bg-emerald-100 text-emerald-700',
  con: 'bg-rose-100 text-rose-700',
  neutral: 'bg-slate-100 text-slate-600',
}

export default function StatsManager({ stats, subMotions }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list')
  const [editing, setEditing] = useState<StatWithRelations | null>(null)
  const [form, setForm] = useState(blankForm)
  const [error, setError] = useState('')

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function openAdd() {
    setForm({ ...blankForm, sub_motion_id: subMotions[0]?.id ?? '' })
    setEditing(null); setError(''); setMode('add')
  }

  function openEdit(s: StatWithRelations) {
    setForm({
      sub_motion_id: s.sub_motion_id,
      side: s.side,
      type: s.type,
      stat_text: s.stat_text,
      context: s.context ?? '',
      source_name: s.source_name,
      source_url: s.source_url,
      source_year: s.source_year?.toString() ?? '',
      iframe_url: s.iframe_url ?? '',
      published: s.published,
    })
    setEditing(s); setError(''); setMode('edit')
  }

  function cancel() { setMode('list'); setError('') }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.sub_motion_id) { setError('Please select a sub-motion.'); return }
    setError('')
    const payload = {
      sub_motion_id: form.sub_motion_id,
      side: form.side,
      type: form.type,
      stat_text: form.stat_text,
      context: form.context,
      source_name: form.source_name,
      source_url: form.source_url,
      source_year: form.source_year ? parseInt(form.source_year) : null,
      iframe_url: form.type === 'iframe' ? form.iframe_url : null,
      published: form.published,
    }
    startTransition(async () => {
      const res = mode === 'add' ? await createStat(payload) : await updateStat(editing!.id, payload)
      if (res.error) { setError(res.error); return }
      setMode('list'); router.refresh()
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this stat?')) return
    startTransition(async () => {
      const res = await deleteStat(id)
      if (res.error) alert(res.error)
      else router.refresh()
    })
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      const res = await toggleStatPublished(id, !current)
      if (res.error) alert(res.error)
      else router.refresh()
    })
  }

  if (mode === 'add' || mode === 'edit') {
    return (
      <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-medium text-gray-900">{mode === 'add' ? 'New Stat' : 'Edit Stat'}</h2>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sub-Motion" required>
              <select value={form.sub_motion_id} onChange={(e) => set('sub_motion_id', e.target.value)} required className={inp}>
                <option value="">Select…</option>
                {subMotions.map((sm) => (
                  <option key={sm.id} value={sm.id}>{sm.topics.name} → {sm.title}</option>
                ))}
              </select>
            </Field>
            <Field label="Side" required>
              <select value={form.side} onChange={(e) => set('side', e.target.value)} className={inp}>
                <option value="pro">Pro</option>
                <option value="con">Con</option>
                <option value="neutral">Neutral</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Type" required>
              <select value={form.type} onChange={(e) => set('type', e.target.value)} className={inp}>
                <option value="text">Text</option>
                <option value="iframe">Iframe</option>
              </select>
            </Field>
            <Field label="Source Year">
              <input type="number" value={form.source_year} onChange={(e) => set('source_year', e.target.value)} min={1900} max={2100} className={inp} />
            </Field>
          </div>
          <Field label="Stat Text" required>
            <textarea value={form.stat_text} onChange={(e) => set('stat_text', e.target.value)} required rows={4} className={inp} />
          </Field>
          <Field label="Context">
            <input value={form.context} onChange={(e) => set('context', e.target.value)} placeholder="One-line explanation of what this measures" className={inp} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Source Name" required>
              <input value={form.source_name} onChange={(e) => set('source_name', e.target.value)} required placeholder="e.g. CDC, Our World in Data" className={inp} />
            </Field>
            <Field label="Source URL" required>
              <input type="url" value={form.source_url} onChange={(e) => set('source_url', e.target.value)} required placeholder="https://…" className={inp} />
            </Field>
          </div>
          {form.type === 'iframe' && (
            <Field label="Iframe URL" required>
              <input type="url" value={form.iframe_url} onChange={(e) => set('iframe_url', e.target.value)} required placeholder="https://…" className={inp} />
            </Field>
          )}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="rounded" />
            <span className="font-medium text-gray-700">Published</span>
            <span className="text-gray-400">(unchecked = draft)</span>
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={isPending} className={btnPrimary}>{isPending ? 'Saving…' : 'Save'}</button>
            <button type="button" onClick={cancel} className={btnSecondary}>Cancel</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <button onClick={openAdd} disabled={subMotions.length === 0} className={`${btnPrimary} mb-4`}>
        + Add Stat
      </button>
      {subMotions.length === 0 && <p className="mb-3 text-sm text-amber-600">Add sub-motions first.</p>}
      {stats.length === 0 ? (
        <p className="text-sm text-gray-400">No stats yet.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              <tr>{['Sub-Motion', 'Side', 'Stat Text', 'Year', 'Status', ''].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {stats.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">
                    <div className="text-xs text-gray-400">{s.sub_motions.topics.name}</div>
                    <div className="line-clamp-1">{s.sub_motions.title}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${sideBadge[s.side]}`}>
                      {s.side}
                    </span>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-gray-700">
                    <span className="line-clamp-2">{s.stat_text}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{s.source_year ?? '—'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(s.id, s.published)}
                      disabled={isPending}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        s.published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {s.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(s)} className="mr-3 text-gray-600 hover:text-gray-900">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

const inp = 'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'
const btnPrimary = 'rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50'
const btnSecondary = 'rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200'
