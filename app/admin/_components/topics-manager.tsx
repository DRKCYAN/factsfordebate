'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createTopic, updateTopic, deleteTopic } from '@/app/admin/_actions/topics'
import type { Topic } from '@/lib/types'

interface Props { topics: Topic[] }

const blank = { name: '', slug: '', description: '' }

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function TopicsManager({ topics }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list')
  const [editing, setEditing] = useState<Topic | null>(null)
  const [form, setForm] = useState(blank)
  const [error, setError] = useState('')

  function set(field: string, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'name' && mode === 'add') next.slug = toSlug(value)
      return next
    })
  }

  function openAdd() { setForm(blank); setEditing(null); setError(''); setMode('add') }
  function openEdit(t: Topic) { setForm({ name: t.name, slug: t.slug, description: t.description ?? '' }); setEditing(t); setError(''); setMode('edit') }
  function cancel() { setMode('list'); setError('') }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const res = mode === 'add' ? await createTopic(form) : await updateTopic(editing!.id, form)
      if (res.error) { setError(res.error); return }
      setMode('list')
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this topic? All sub-motions and stats under it will also be deleted.')) return
    startTransition(async () => {
      const res = await deleteTopic(id)
      if (res.error) alert(res.error)
      else router.refresh()
    })
  }

  if (mode === 'add' || mode === 'edit') {
    return (
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-medium text-gray-900">{mode === 'add' ? 'New Topic' : 'Edit Topic'}</h2>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label="Name" required>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} required className={input} />
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
      <button onClick={openAdd} className={`${btnPrimary} mb-4`}>+ Add Topic</button>
      {topics.length === 0 ? (
        <p className="text-sm text-gray-400">No topics yet.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              <tr>
                {['Name', 'Slug', 'Description', ''].map((h) => (
                  <th key={h} className="px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {topics.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
                  <td className="px-4 py-3 text-gray-500">{t.slug}</td>
                  <td className="max-w-xs px-4 py-3 text-gray-500">
                    <span className="line-clamp-1">{t.description}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(t)} className="mr-3 text-gray-600 hover:text-gray-900">Edit</button>
                    <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700">Delete</button>
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
