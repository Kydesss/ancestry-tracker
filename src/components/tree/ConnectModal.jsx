import { useState } from 'react'
import useStore from '../../store/useStore'

/**
 * Small modal shown after the user drags a connection between two cards.
 * Lets them choose the relationship type before saving.
 */
export default function ConnectModal({ isOpen, sourceMember, targetMember, onConfirm, onClose }) {
  const [relType, setRelType] = useState('child')

  if (!isOpen || !sourceMember || !targetMember) return null

  function handleConfirm() {
    onConfirm(relType)
    setRelType('child')
  }

  function handleClose() {
    onClose()
    setRelType('child')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-modal max-w-sm w-full z-10 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Connect People</h2>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            How is <span className="font-semibold text-gray-900">{targetMember.name}</span> related to <span className="font-semibold text-gray-900">{sourceMember.name}</span>?
          </p>

          <div className="space-y-2">
            <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${relType === 'child' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input
                type="radio"
                name="relType"
                value="child"
                checked={relType === 'child'}
                onChange={() => setRelType('child')}
                className="text-primary-600"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">Child of {sourceMember.name}</p>
                <p className="text-xs text-gray-500">{sourceMember.name} → parent of → {targetMember.name}</p>
              </div>
            </label>

            <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${relType === 'partner' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input
                type="radio"
                name="relType"
                value="partner"
                checked={relType === 'partner'}
                onChange={() => setRelType('partner')}
                className="text-primary-600"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">Partner of {sourceMember.name}</p>
                <p className="text-xs text-gray-500">{sourceMember.name} ↔ partner ↔ {targetMember.name}</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button type="button" onClick={handleClose} className="btn-secondary">Cancel</button>
          <button type="button" onClick={handleConfirm} className="btn-primary">Connect</button>
        </div>
      </div>
    </div>
  )
}
