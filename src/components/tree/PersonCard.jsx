import { memo, useState } from 'react'
import { Handle, Position } from 'reactflow'
import Avatar from '../ui/Avatar'
import { format } from '../tree/dateUtils'

function PersonCard({ data }) {
  const { member, onEdit, onDelete, onAddPartner, onAddChild } = data
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="bg-container-lowest rounded-md border border-outline-variant shadow-card hover:shadow-card-hover transition-all duration-300 w-52 relative group">
      {/* React Flow handles */}
      <Handle type="target" position={Position.Top} className="!bg-tertiary-accent !w-2.5 !h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Bottom} className="!bg-tertiary-accent !w-2.5 !h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Left} className="!bg-tertiary-accent !w-2.5 !h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="target" position={Position.Right} className="!bg-tertiary-accent !w-2.5 !h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />

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

        {/* Action buttons */}
        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(member)}
            className="p-1.5 rounded bg-container-low hover:bg-primary-fixed text-ink-variant hover:text-primary transition-colors"
            title="Edit person"
          >
            <PencilIcon />
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 rounded bg-container-low hover:bg-danger-container text-ink-variant hover:text-danger-on-container transition-colors"
            title="Remove person"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Add partner / child buttons */}
      <div className="border-t border-outline-variant/60 flex divide-x divide-outline-variant/60">
        <button
          onClick={() => onAddPartner(member)}
          className="flex-1 py-2 text-xs font-semibold uppercase tracking-wide text-ink-variant hover:bg-container-low hover:text-primary transition-colors flex items-center justify-center gap-1"
          title="Add partner"
        >
          <span className="text-base leading-none">+</span> Partner
        </button>
        <button
          onClick={() => onAddChild(member)}
          className="flex-1 py-2 text-xs font-semibold uppercase tracking-wide text-ink-variant hover:bg-container-low hover:text-primary transition-colors flex items-center justify-center gap-1"
          title="Add child"
        >
          <span className="text-base leading-none">+</span> Child
        </button>
      </div>

      {/* Delete confirmation dialog */}
      {confirmDelete && (
        <div className="absolute inset-0 bg-container-lowest/95 backdrop-blur-sm rounded-md flex flex-col items-center justify-center p-4 z-10">
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
