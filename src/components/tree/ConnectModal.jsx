import { useEffect, useState } from 'react'

export default function ConnectModal({ isOpen, sourceMember, targetMember, onConfirm, onClose }) {
  const [relType, setRelType] = useState('child')

  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
        setRelType('child')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

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
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-container-lowest rounded-md shadow-modal max-w-sm w-full z-10 overflow-hidden border border-outline-variant/60">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/60">
          <h2 className="font-serif text-base font-semibold text-ink">Connect People</h2>
          <button onClick={handleClose} className="p-1.5 rounded hover:bg-container-low focus:bg-container-low text-ink-variant hover:text-ink focus:text-ink focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors" aria-label="Close connection form">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-ink-variant">
            How is <span className="font-serif font-semibold text-ink">{targetMember.name}</span> related to <span className="font-serif font-semibold text-ink">{sourceMember.name}</span>?
          </p>

          <div className="space-y-2.5">
            <label className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-all border ${relType === 'child' ? 'border-primary bg-primary-fixed/40 shadow-card' : 'border-outline-variant hover:border-outline'}`}>
              <input
                type="radio"
                name="relType"
                value="child"
                checked={relType === 'child'}
                onChange={() => setRelType('child')}
                className="text-primary focus:ring-primary-300"
              />
              <div>
                <p className="font-serif text-sm font-semibold text-ink">Child of {sourceMember.name}</p>
                <p className="text-xs text-ink-variant mt-0.5">{sourceMember.name} is a parent of {targetMember.name}</p>
              </div>
            </label>

            <label className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-all border ${relType === 'partner' ? 'border-primary bg-primary-fixed/40 shadow-card' : 'border-outline-variant hover:border-outline'}`}>
              <input
                type="radio"
                name="relType"
                value="partner"
                checked={relType === 'partner'}
                onChange={() => setRelType('partner')}
                className="text-primary focus:ring-primary-300"
              />
              <div>
                <p className="font-serif text-sm font-semibold text-ink">Partner of {sourceMember.name}</p>
                <p className="text-xs text-ink-variant mt-0.5">{sourceMember.name} and {targetMember.name} are partners</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/60 bg-container-low">
          <button type="button" onClick={handleClose} className="btn-secondary">Cancel</button>
          <button type="button" onClick={handleConfirm} className="btn-primary">Connect</button>
        </div>
      </div>
    </div>
  )
}
