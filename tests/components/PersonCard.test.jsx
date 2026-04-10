import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PersonCard from '../../src/components/tree/PersonCard'
import { ReactFlowProvider } from 'reactflow'

const baseCallbacks = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onAddPartner: vi.fn(),
  onAddChild: vi.fn(),
}

function renderCard(memberOverrides = {}) {
  const member = {
    id: 'test-id',
    name: 'Jane Doe',
    dob: '1990-06-15',
    dod: null,
    photo_url: null,
    ...memberOverrides,
  }
  return render(
    <ReactFlowProvider>
      <PersonCard data={{ member, ...baseCallbacks }} />
    </ReactFlowProvider>
  )
}

describe('PersonCard', () => {
  it('renders the member name', () => {
    renderCard()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
  })

  it('renders date of birth', () => {
    renderCard()
    expect(screen.getByText(/Jun 15, 1990/)).toBeInTheDocument()
  })

  it('does NOT render dod when dod is null', () => {
    renderCard({ dod: null })
    expect(screen.queryByText(/✝/)).not.toBeInTheDocument()
  })

  it('renders dod and ✝ icon when dod is set', () => {
    renderCard({ dod: '2050-01-01' })
    expect(screen.getByText(/✝/)).toBeInTheDocument()
  })

  it('renders default avatar initials when photo_url is null', () => {
    renderCard({ photo_url: null, name: 'Jane Doe' })
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('renders an img when photo_url is provided', () => {
    renderCard({ photo_url: 'https://example.com/photo.jpg' })
    const img = screen.getByRole('img', { name: /Jane Doe/ })
    expect(img).toBeInTheDocument()
    expect(img.src).toContain('example.com')
  })

  it('shows Add Partner and Add Child buttons', () => {
    renderCard()
    expect(screen.getByTitle('Add partner')).toBeInTheDocument()
    expect(screen.getByTitle('Add child')).toBeInTheDocument()
  })
})
