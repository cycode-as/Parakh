// Feature: parakh, Property 2: Score color mapping is correct for all values

import * as fc from 'fast-check'
import { getScoreColor } from '../lib/colors.js'

/**
 * Validates: Requirements 5.2–5.4, 6.2–6.4, 9.1–9.3
 *
 * Property 2: Score color mapping is correct for all values 0–100
 * For any integer score in [0, 100]:
 *   - score >= 70  → '#16a34a' (green)
 *   - 40 <= score < 70 → '#d97706' (amber)
 *   - score < 40   → '#dc2626' (red)
 */

describe('getScoreColor — Property 2: Score color mapping is correct for all values', () => {
  // ── Property-based test ─────────────────────────────────────────────────────

  test('returns correct hex color for every integer in [0, 100]', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 100 }), (score) => {
        const color = getScoreColor(score)

        if (score >= 70) {
          expect(color).toBe('#16a34a')
        } else if (score >= 40) {
          expect(color).toBe('#d97706')
        } else {
          expect(color).toBe('#dc2626')
        }
      }),
      { numRuns: 100 }
    )
  })

  // ── Exact boundary example-based tests ─────────────────────────────────────

  describe('boundary values', () => {
    test('score 39 → red (#dc2626)', () => {
      expect(getScoreColor(39)).toBe('#dc2626')
    })

    test('score 40 → amber (#d97706)', () => {
      expect(getScoreColor(40)).toBe('#d97706')
    })

    test('score 69 → amber (#d97706)', () => {
      expect(getScoreColor(69)).toBe('#d97706')
    })

    test('score 70 → green (#16a34a)', () => {
      expect(getScoreColor(70)).toBe('#16a34a')
    })
  })

  // ── Additional edge examples ────────────────────────────────────────────────

  describe('edge values', () => {
    test('score 0 → red (#dc2626)', () => {
      expect(getScoreColor(0)).toBe('#dc2626')
    })

    test('score 100 → green (#16a34a)', () => {
      expect(getScoreColor(100)).toBe('#16a34a')
    })
  })
})

// Feature: parakh, Property 3: Recommendation color mapping is exhaustive and correct

import { getRecommendationColor } from '../lib/colors.js'

/**
 * Validates: Requirements 8.2, 9.1–9.3
 *
 * Property 3: Recommendation color mapping is exhaustive and correct
 * For any valid recommendation value:
 *   - 'apply'   → '#16a34a' (green)
 *   - 'upskill' → '#d97706' (amber)
 *   - 'avoid'   → '#dc2626' (red)
 */

describe('getRecommendationColor — Property 3: Recommendation color mapping is exhaustive and correct', () => {
  // ── Property-based test ─────────────────────────────────────────────────────

  test('returns correct hex color for every valid recommendation value', () => {
    const EXPECTED = {
      apply: '#16a34a',
      upskill: '#d97706',
      avoid: '#dc2626',
    }

    fc.assert(
      fc.property(fc.constantFrom('apply', 'upskill', 'avoid'), (recommendation) => {
        const color = getRecommendationColor(recommendation)
        expect(color).toBe(EXPECTED[recommendation])
      }),
      { numRuns: 100 }
    )
  })

  // ── Example-based tests ─────────────────────────────────────────────────────

  describe('example-based: each recommendation value', () => {
    test('"apply" → green (#16a34a)', () => {
      expect(getRecommendationColor('apply')).toBe('#16a34a')
    })

    test('"upskill" → amber (#d97706)', () => {
      expect(getRecommendationColor('upskill')).toBe('#d97706')
    })

    test('"avoid" → red (#dc2626)', () => {
      expect(getRecommendationColor('avoid')).toBe('#dc2626')
    })
  })
})
