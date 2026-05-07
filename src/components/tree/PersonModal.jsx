import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { getAuthenticatedClient } from '../../lib/supabaseClient'
import useStore from '../../store/useStore'
import { useSubscription } from '../../hooks/useSubscription'

const defaultForm = {
  name: '',
  dob: '',
  isDeceased: false,
  dod: '',
  photo: null,
  photoPreview: null,
  relationshipType: 'child',
}

export default function PersonModal({ isOpen, onClose, editMember, relationshipType, parentMember, spawnPosition }) {
  const [form, setForm] = useState({ ...defaultForm, relationshipType: relationshipType || 'child' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const { getToken, userId } = useAuth()
  const activeTree = useStore((s) => s.activeTree)
  const addMember = useStore((s) => s.addMember)
  const updateMember = useStore((s) => s.updateMember)
  const addRelationship = useStore((s) => s.addRelationship)
  const showToast = useStore((s) => s.showToast)
  const members = useStore((s) => s.members)
  const relationships = useStore((s) => s.relationships)
  const { checkAccess, FREE_MEMBER_LIMIT } = useSubscription()

  const isEdit = !!editMember

  useEffect(() => {
    if (isOpen) {
      if (editMember) {
        setForm({
          name: editMember.name || '',
          dob: editMember.dob || '',
          isDeceased: !!editMember.dod,
          dod: editMember.dod || '',
          photo: null,
          photoPreview: editMember.photo_url || null,
          relationshipType: relationshipType || 'child',
        })
      } else {
        setForm({ ...defaultForm, relationshipType: relationshipType || 'child' })
      }
      setError(null)
    }
  }, [isOpen, editMember, relationshipType])

  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    set('photo', file)
    set('photoPreview', URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.dob) return

    if (!activeTree) {
      setError('Your family tree is still opening. Please wait a moment and try again.')
      return
    }

    // Check free tier limit for new members
    if (!isEdit && !checkAccess('add_member')) {
      setError(`The free plan includes ${FREE_MEMBER_LIMIT} people. Upgrade when your family record is ready to grow further.`)
      return
    }

    setSaving(true)
    setError(null)

    try {
      const token = await getToken({ template: 'supabase' })
      const client = getAuthenticatedClient(token)

      let photo_url = editMember?.photo_url || null
      const newMemberId = !isEdit && form.photo ? crypto.randomUUID() : null

      // Upload photo if a new file was selected
      if (form.photo) {
        if (!userId) throw new Error('Please sign in again before adding a portrait.')
        const memberId = editMember?.id || newMemberId
        const avatarPath = `${userId}/${memberId}`
        const { error: uploadError } = await client.storage
          .from('avatars')
          .upload(avatarPath, form.photo, { upsert: true })
        if (uploadError) throw uploadError
        const { data: urlData } = client.storage.from('avatars').getPublicUrl(avatarPath)
        photo_url = urlData.publicUrl
      }

      const payload = {
        tree_id: activeTree.id,
        name: form.name.trim(),
        dob: form.dob,
        dod: form.isDeceased && form.dod ? form.dod : null,
        photo_url,
      }

      if (isEdit) {
        const { data, error: updateError } = await client
          .from('members')
          .update(payload)
          .eq('id', editMember.id)
          .select()
          .single()
        if (updateError) throw updateError
        updateMember(editMember.id, data)
        showToast(`${data.name} updated.`, 'success')
      } else {
        const pos = spawnPosition ?? { x: 50 + members.length * 220, y: 50 }
        const { data, error: insertError } = await client
          .from('members')
          .insert({ ...payload, ...(newMemberId ? { id: newMemberId } : {}), position_x: Math.round(pos.x), position_y: Math.round(pos.y) })
          .select()
          .single()
        if (insertError) throw insertError
        addMember(data)

        // Create relationship if there's a parent member
        if (parentMember) {
          const relPayload = {
            tree_id: activeTree.id,
            from_member_id: parentMember.id,
            to_member_id: data.id,
            type: form.relationshipType,
          }
          const { data: relData, error: relError } = await client
            .from('relationships')
            .insert(relPayload)
            .select()
            .single()
          if (!relError && relData) addRelationship(relData)

          if (form.relationshipType === 'child') {
            // Adding a child: also link child to parentMember's existing partner
            const partnerRel = relationships.find(
              (r) =>
                r.type === 'partner' &&
                (r.from_member_id === parentMember.id || r.to_member_id === parentMember.id)
            )
            if (partnerRel) {
              const partnerId =
                partnerRel.from_member_id === parentMember.id
                  ? partnerRel.to_member_id
                  : partnerRel.from_member_id
              const { data: pRel } = await client
                .from('relationships')
                .insert({ tree_id: activeTree.id, from_member_id: partnerId, to_member_id: data.id, type: 'child' })
                .select().single()
              if (pRel) addRelationship(pRel)
            }
          } else if (form.relationshipType === 'partner') {
            // Adding a partner: link the new partner to all existing children of parentMember,
            // and link parentMember to all existing children of the new partner (none yet, but
            // future-proof). This ensures the family node appears immediately.
            const existingChildren = relationships
              .filter((r) => r.type === 'child' && r.from_member_id === parentMember.id)
            for (const childRel of existingChildren) {
              const alreadyLinked = relationships.some(
                (r) => r.type === 'child' && r.from_member_id === data.id && r.to_member_id === childRel.to_member_id
              )
              if (!alreadyLinked) {
                const { data: newRel } = await client
                  .from('relationships')
                  .insert({ tree_id: activeTree.id, from_member_id: data.id, to_member_id: childRel.to_member_id, type: 'child' })
                  .select().single()
                if (newRel) addRelationship(newRel)
              }
            }
          }
        }

        showToast(`${data.name} added to tree.`, 'success')
      }

      onClose()
    } catch (err) {
      setError(err.message || 'We could not save this person. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-container-lowest rounded-md shadow-modal max-w-md w-full z-10 overflow-hidden border border-outline-variant/60">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/60">
          <div>
            <span className="label-meta block mb-0.5">{isEdit ? 'Update Record' : 'New Record'}</span>
            <h2 className="font-serif text-headline-md font-semibold text-ink">
              {isEdit ? 'Edit Person' : 'Add Person'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-container-low focus:bg-container-low text-ink-variant hover:text-ink focus:text-ink focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors" aria-label="Close person form">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form id="person-form" onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Profile Photo */}
          <div>
            <label className="label">Portrait</label>
            <div className="flex items-center gap-4">
              {form.photoPreview ? (
                <img src={form.photoPreview} alt="Preview" className="w-16 h-16 rounded-md object-cover border border-outline-variant shadow-card" />
              ) : (
                <div className="w-16 h-16 rounded-md bg-container-low border border-outline-variant flex items-center justify-center text-ink-variant">
                  <svg className="w-7 h-7" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <label className="btn-secondary text-xs cursor-pointer">
                Choose photo
                <input type="file" accept="image/*" className="sr-only" onChange={handlePhotoChange} />
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="label">Full Name <span className="text-danger">*</span></label>
            <input
              className="input"
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Jane Smith"
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="label">Date of Birth <span className="text-danger">*</span></label>
            <input
              className="input"
              type="date"
              value={form.dob}
              onChange={(e) => set('dob', e.target.value)}
              required
            />
          </div>

          {/* Deceased toggle */}
          <div className="flex items-center gap-3">
            <input
              id="deceased"
              type="checkbox"
              checked={form.isDeceased}
              onChange={(e) => set('isDeceased', e.target.checked)}
              className="w-4 h-4 rounded border-outline text-primary focus:ring-primary-300"
            />
            <label htmlFor="deceased" className="text-sm text-ink-variant cursor-pointer">
              Mark as deceased
            </label>
          </div>

          {/* Date of Death */}
          {form.isDeceased && (
            <div>
              <label className="label">Date of Passing</label>
              <input
                className="input"
                type="date"
                value={form.dod}
                onChange={(e) => set('dod', e.target.value)}
              />
            </div>
          )}

          {/* Relationship type (only for new members with a parent) */}
          {!isEdit && parentMember && (
            <div>
              <label className="label">Relationship to {parentMember.name}</label>
              <select
                className="input"
                value={form.relationshipType}
                onChange={(e) => set('relationshipType', e.target.value)}
              >
                <option value="child">Child</option>
                <option value="partner">Partner</option>
              </select>
            </div>
          )}

          {error && (
            <p className="text-sm leading-6 text-danger-on-container bg-danger-container/60 rounded px-3 py-2">{error}</p>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/60 bg-container-low">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            form="person-form"
            disabled={saving || !form.name || !form.dob}
            className="btn-primary"
          >
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Person'}
          </button>
        </div>
      </div>
    </div>
  )
}
