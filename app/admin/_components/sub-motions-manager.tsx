'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createSubMotion, updateSubMotion, deleteSubMotion } from '@/app/admin/_actions/sub-motions'
import type { Topic, SubMotion } from '@/lib/types'

type SubMotionWithTopic = SubMotion & { topics: { name: string } }
interface Props { topics: Topic[]; subMotions: SubMotionWithTopic[] }

const blank = { topic_id: '', title: '', slug: '', description: '' }

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function SubMotionsManager({ topics, subMotions }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list')
  const [editing, setEditing] = useState<SubMotionWithTopic | null>(null)
  const [form, setForm] = useState(blank)
  const [error, setError] = useState('')

  function set(field: string, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'title' && mode === 'add') next.slug = toSlug(value)
      return next
    })
  }

  function openAdd() { setForm({ ...blank, topic_id: topics[0]?.id ?? '' }); setEditing(null); setError(''); setMode('add') }
  function openEdit(sm: SubMotionWithTopic) {
    setForm({ topic_id: sm.topic_id, title: sm.title, slug: sm.slug, description: sm.description ?? '' })
    setEditing(sm); setError(''); setMode('edit')
  }
  function cancel() { setMode('list'); setError('') }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.topic_id) { setError('Please select a topic.'); return }
    setError('')
    startTransition(async () => {
      const res = mode === 'add' ? await createSubMotion(form) : await updateSubMotion(editing!.id, form)
      if (res.error) { setError(res.error); return }
      setMode('list'); router.refresh()
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this sub-motion? All stats under it will also be deleted.')) return
    startTransition(async () => {
      const res = await deleteSubMotion(id)
      if (res.error) alert(res.error)
      else router.refresh()
    })
  }

  if (mode === 'add' || mode === 'edit') {
    return (
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-medium text-gray-900">{mode === 'add' ? 'New Sub-Motion' : 'Edit Sub-Motion'}</h2>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label="Topic" required>
            <select value={form.topic_id} onChange={(e) => set('topic_id', e.target.value)} required className={input}>
              <option value="">Select topic…</option>
              {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Field>
          <Field label="Title" required>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} required className={input} />
          </Field>
          <Field label="Slug" required>
            <input value={form.slug} onChange={(e) => set('slug', e.target.value)} required pattern="[a-z0-9-]+" className={input} />
          </Field>
          <Field label="Description">
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className={input} />
          </Field>
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
      <button onClick={openAdd} className={`${btnPrimary} mb-4`} disabled={topics.length === 0}>
        + Add Sub-Motion
      </button>
      {topics.length === 0 && <p className="mb-3 text-sm text-amber-600">Add a topic first before adding sub-motions.</p>}
      {subMotions.length === 0 ? (
        <p className="text-sm text-gray-400">No sub-motions yet.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              <tr>{['Topic', 'Title', 'Slug', ''].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {subMotions.map((sm) => (
                <tr key={sm.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{sm.topics.name}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{sm.title}</td>
                  <td className="px-4 py-3 text-gray-500">{sm.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(sm)} className="mr-3 text-gray-600 hover:text-gray-900">Edit</button>
                    <button onClick={() => handleDelete(sm.id)} className="text-red-500 hover:text-red-700">Delete</button>
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
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const input = 'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'
const btnPrimary = 'rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50'
const btnSecondary = 'rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200'
