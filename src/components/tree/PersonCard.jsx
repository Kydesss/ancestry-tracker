import { memo, useState } from 'react'
import { Handle, Position } from 'reactflow'
import Avatar from '../ui/Avatar'
import { format } from '../tree/dateUtils'

function PersonCard({ data }) {
  const { member, onEdit, onDelete, onAddPartner, onAddChild } = data
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-card hover:shadow-card-hover transition-shadow w-52 relative group">
      {/* React Flow handles */}
      <Handle type="target" position={Position.Top} className="!bg-gray-300 !w-2.5 !h-2.5" />
      <Handle type="source" position={Position.Bottom} className="!bg-gray-300 !w-2.5 !h-2.5" />

      <div className="p-4">
        {/* Avatar + name */}
        <div className="flex flex-col items-center text-center mb-3">
          <Avatar src={member.photo_url} name={member.name} size="xl" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 leading-tight">{member.name}</h3>

          {/* Dates */}
          <div className="mt-1 text-xs text-gray-500 space-y-0.5">
            <p>b. {format(member.dob)}</p>
            {member.dod && (
              <p className="text-gray-400">✝ {format(member.dod)}</p>
            )}
          </div>
        </div>

        {/* Action buttons (edit + delete) */}
        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(member)}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-primary-100 text-gray-500 hover:text-primary-700 transition-colors"
            title="Edit person"
          >
            <PencilIcon />
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
            title="Delete person"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Add partner / child buttons */}
      <div className="border-t border-gray-100 flex divide-x divide-gray-100">
        <button
          onClick={() => onAddPartner(member)}
          className="flex-1 py-2 text-xs text-gray-500 hover:bg-gray-50 hover:text-primary-600 transition-colors flex items-center justify-center gap-1 rounded-bl-2xl"
          title="Add partner"
        >
          <span className="text-base leading-none">+</span> Partner
        </button>
        <button
          onClick={() => onAddChild(member)}
          className="flex-1 py-2 text-xs text-gray-500 hover:bg-gray-50 hover:text-primary-600 transition-colors flex items-center justify-center gap-1 rounded-br-2xl"
          title="Add child"
        >
          <span className="text-base leading-none">+</span> Child
        </button>
      </div>

      {/* Delete confirmation dialog */}
      {confirmDelete && (
        <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-4 z-10">
          <p className="text-sm font-medium text-gray-900 text-center mb-1">Delete {member.name}?</p>
          <p className="text-xs text-gray-500 text-center mb-4">This also removes all their relationships.</p>
          <div className="flex gap-2">
            <button
              onClick={() => { onDelete(member); setConfirmDelete(false) }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
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
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  )
}

export default memo(PersonCard)
