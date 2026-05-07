export default function Avatar({ src, name, size = 'md' }) {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  const initials = name
    ? name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`${sizes[size]} rounded-md object-cover flex-shrink-0 bg-container-low border border-outline-variant`}
      />
    )
  }

  return (
    <div
      className={`${sizes[size]} rounded-md bg-tertiary-fixed text-tertiary-on-container font-serif font-semibold flex items-center justify-center flex-shrink-0 border border-outline-variant`}
    >
      {initials}
    </div>
  )
}
