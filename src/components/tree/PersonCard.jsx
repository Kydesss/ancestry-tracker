import { memo, useState } from 'react'
import { Handle, Position } from 'reactflow'
import Avatar from '../ui/Avatar'
import { format } from '../tree/dateUtils'

function PersonCard({ data }) {
  const { member, onEdit, onDelete, onAddPartner, onAddChild } = data
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="bg-container-lowest rounded-md border border-outline-variant shadow-card hover:shadow-card-hover focus-within:shadow-card-hover transition-all duration-300 w-52 relative group">
      {/* React Flow handles — bg/size in .person-handle (CSS); visibility via Tailwind.
          Each side gets BOTH source and target handles so partner edges (horizontal)
          and parent/child edges (vertical) resolve regardless of card layout. */}
      <Handle id="top"    type="target" position={Position.Top}    className="person-handle opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="person-handle opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle id="left"   type="source" position={Position.Left}   className="person-handle opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle id="left"   type="target" position={Position.Left}   className="person-handle opacity-0" />
      <Handle id="right"  type="target" position={Position.Right}  className="person-handle opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle id="right"  type="source" position={Position.Right}  className="person-handle opacity-0" />

      <div className="p-4">
        {/* Avatar + name */}
        <div className="flex flex-col items-center text-center mb-3">
          <Avatar src={member.photo_url} name={member.name} size="xl" />
          <h3 className="mt-2 font-serif text-base font-semibold text-ink leading-tight">{member.name}</h3>

          {/* Dates */}
          <div className="mt-1.5 text-xs text-ink-variant space-y-0.5 font-sans">
            <p className="tabular-nums">b. {format(member.dob)}</p>
            {member.dod && (
              <p className="text-outline tabular-nums">d. {format(member.dod)}</p>
            )}
          </div>
        </div>

        {/* Action buttons — visible at low opacity by default; full on hover/focus */}
        <div className="flex justify-center gap-2 opacity-60 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(member)}
            className="p-1.5 rounded bg-container-low hover:bg-primary-fixed text-ink-variant hover:text-primary
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 transition-colors"
            aria-label={`Edit ${member.name}`}
            title="Edit person"
          >
            <PencilIcon />
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 rounded bg-container-low hover:bg-danger-container text-ink-variant hover:text-danger-on-container
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-danger/40 transition-colors"
            aria-label={`Remove ${member.name}`}
            title="Remove person"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Add partner / child buttons */}
      <div className="border-t border-outline-variant/60 flex divide-x divide-outline-variant/60 rounded-b-md">
        <button
          onClick={() => onAddPartner(member)}
          className="flex-1 min-h-[44px] py-2 text-xs font-semibold uppercase tracking-wide text-ink-variant hover:bg-container-low hover:text-primary focus:bg-container-low focus:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-300 transition-colors flex items-center justify-center gap-1 rounded-bl-md"
          aria-label={`Add partner for ${member.name}`}
          title="Add partner"
        >
          <span className="text-base leading-none">+</span> Partner
        </button>
        <button
          onClick={() => onAddChild(member)}
          className="flex-1 min-h-[44px] py-2 text-xs font-semibold uppercase tracking-wide text-ink-variant hover:bg-container-low hover:text-primary focus:bg-container-low focus:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-300 transition-colors flex items-center justify-center gap-1 rounded-br-md"
          aria-label={`Add child for ${member.name}`}
          title="Add child"
        >
          <span className="text-base leading-none">+</span> Child
        </button>
      </div>

      {/* Delete confirmation dialog — solid surface, no glass */}
      {confirmDelete && (
        <div
          role="alertdialog"
          aria-label={`Confirm removal of ${member.name}`}
          className="absolute inset-0 bg-container-lowest border border-outline-variant rounded-md flex flex-col items-center justify-center p-4 z-10"
        >
          <p className="font-serif text-sm font-semibold text-ink text-center mb-1">Remove {member.name}?</p>
          <p className="text-xs text-ink-variant text-center mb-4">This also removes all their relationships.</p>
          <div className="flex gap-2">
            <button
              onClick={() => { onDelete(member); setConfirmDelete(false) }}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-danger text-danger-on hover:bg-danger-on-container transition-colors"
            >
              Remove
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-container-high text-ink-variant hover:bg-container-highest transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PencilIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    </svg>
  )
}

export default memo(PersonCard)
