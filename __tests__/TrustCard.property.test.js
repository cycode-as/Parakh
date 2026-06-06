// Feature: parakh, Property 7: Red flags list is always capped at 5 displayed items

import * as fc from 'fast-check'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import TrustCard from '../components/TrustCard.jsx'

/**
 * Validates: Requirements 5.5
 *
 * Property 7: Red flags list is always capped at 5 displayed items
 * For any array of red flag strings passed to TrustCard:
 *   - The component SHALL render exactly Math.min(5, red_flags.length) <li> bullet items
 *   - For any array with more than 5 items, an overflow indicator ("+N more") SHALL be rendered
 *   - For any array with 5 or fewer items, no overflow indicator SHALL be rendered
 */

describe('TrustCard — Property 7: Red flags list is always capped at 5 displayed items', () => {
  // ── Property-based test ─────────────────────────────────────────────────────

  test('rendered bullet count equals Math.min(5, arr.length) and overflow indicator present iff arr.length > 5', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 20 }),
        (arr) => {
          const { unmount } = render(
            <TrustCard
              trust_score={85}
              risk_level="low"
              red_flags={arr}
              positive_signals={[]}
            />
          )

          const expectedCount = Math.min(5, arr.length)

          // Query list items — TrustCard renders red flags inside a <ul> as <li> elements.
          // positive_signals is empty so any listitem belongs to red_flags.
          const listItems = screen.queryAllByRole('listitem')
          expect(listItems).toHaveLength(expectedCount)

          // Overflow indicator: "+N more" paragraph present iff arr.length > 5
          const overflowCount = arr.length - 5
          if (arr.length > 5) {
            expect(
              screen.getByText(`+${overflowCount} more`)
            ).toBeInTheDocument()
          } else {
            // No overflow paragraph should exist
            const overflowEl = screen.queryByText(/^\+\d+ more$/)
            expect(overflowEl).not.toBeInTheDocument()
          }

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  // ── Example-based tests ─────────────────────────────────────────────────────

  describe('empty red_flags array', () => {
    test('renders 0 list items and no overflow indicator', () => {
      render(
        <TrustCard
          trust_score={85}
          risk_level="low"
          red_flags={[]}
          positive_signals={[]}
        />
      )
      expect(screen.queryAllByRole('listitem')).toHaveLength(0)
      expect(screen.queryByText(/^\+\d+ more$/)).not.toBeInTheDocument()
    })
  })

  describe('red_flags with exactly 5 items (boundary)', () => {
    test('renders exactly 5 list items and no overflow indicator', () => {
      const flags = ['flag1', 'flag2', 'flag3', 'flag4', 'flag5']
      render(
        <TrustCard
          trust_score={85}
          risk_level="low"
          red_flags={flags}
          positive_signals={[]}
        />
      )
      expect(screen.getAllByRole('listitem')).toHaveLength(5)
      expect(screen.queryByText(/^\+\d+ more$/)).not.toBeInTheDocument()
    })
  })

  describe('red_flags with 6 items (overflow by 1)', () => {
    test('renders 5 list items and shows "+1 more"', () => {
      const flags = ['flag1', 'flag2', 'flag3', 'flag4', 'flag5', 'flag6']
      render(
        <TrustCard
          trust_score={85}
          risk_level="low"
          red_flags={flags}
          positive_signals={[]}
        />
      )
      expect(screen.getAllByRole('listitem')).toHaveLength(5)
      expect(screen.getByText('+1 more')).toBeInTheDocument()
    })
  })

  describe('red_flags with 20 items (max generator bound)', () => {
    test('renders 5 list items and shows "+15 more"', () => {
      const flags = Array.from({ length: 20 }, (_, i) => `flag${i + 1}`)
      render(
        <TrustCard
          trust_score={85}
          risk_level="low"
          red_flags={flags}
          positive_signals={[]}
        />
      )
      expect(screen.getAllByRole('listitem')).toHaveLength(5)
      expect(screen.getByText('+15 more')).toBeInTheDocument()
    })
  })

  describe('red_flags with 3 items (below cap)', () => {
    test('renders exactly 3 list items and no overflow indicator', () => {
      const flags = ['flagA', 'flagB', 'flagC']
      render(
        <TrustCard
          trust_score={40}
          risk_level="medium"
          red_flags={flags}
          positive_signals={[]}
        />
      )
      expect(screen.getAllByRole('listitem')).toHaveLength(3)
      expect(screen.queryByText(/^\+\d+ more$/)).not.toBeInTheDocument()
    })
  })
})
