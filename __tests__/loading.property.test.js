// Feature: careershield-ai, Property 6: Loading message cycling covers all messages and repeats correctly

import * as fc from 'fast-check'
import { MESSAGES, getMessageAtTick } from '../components/LoadingState.jsx'

/**
 * Validates: Requirements 4.3
 *
 * Property 6: Loading message cycling covers all messages and repeats correctly
 * For any non-negative integer N representing the number of interval ticks elapsed:
 *   getMessageAtTick(N) === MESSAGES[N % MESSAGES.length]
 *
 * This ensures the cycling is purely index-based and wraps around correctly for
 * all possible tick values.
 */

describe('getMessageAtTick — Property 6: Loading message cycling covers all messages and repeats correctly', () => {
  // ── Property-based test ─────────────────────────────────────────────────────

  test('returns MESSAGES[N % MESSAGES.length] for any non-negative integer N', () => {
    fc.assert(
      fc.property(fc.nat(), (n) => {
        const expected = MESSAGES[n % MESSAGES.length]
        const actual = getMessageAtTick(n)
        expect(actual).toBe(expected)
      }),
      { numRuns: 100 }
    )
  })

  // ── Example-based tests: first full cycle ───────────────────────────────────

  describe('first cycle (ticks 0–3)', () => {
    test('tick 0 → "Scanning job for red flags..."', () => {
      expect(getMessageAtTick(0)).toBe('Scanning job for red flags...')
    })

    test('tick 1 → "Reading your resume..."', () => {
      expect(getMessageAtTick(1)).toBe('Reading your resume...')
    })

    test('tick 2 → "Comparing skills..."', () => {
      expect(getMessageAtTick(2)).toBe('Comparing skills...')
    })

    test('tick 3 → "Generating your report..."', () => {
      expect(getMessageAtTick(3)).toBe('Generating your report...')
    })
  })

  // ── Example-based tests: second cycle (wrap-around) ─────────────────────────

  describe('second cycle (ticks 4–7)', () => {
    test('tick 4 wraps to message 0 ("Scanning job for red flags...")', () => {
      expect(getMessageAtTick(4)).toBe(MESSAGES[0])
    })

    test('tick 7 wraps to message 3 ("Generating your report...")', () => {
      expect(getMessageAtTick(7)).toBe(MESSAGES[3])
    })
  })

  // ── Structural sanity ────────────────────────────────────────────────────────

  describe('MESSAGES array integrity', () => {
    test('MESSAGES has exactly 4 entries', () => {
      expect(MESSAGES).toHaveLength(4)
    })

    test('MESSAGES contains the required step strings in order', () => {
      expect(MESSAGES).toEqual([
        'Scanning job for red flags...',
        'Reading your resume...',
        'Comparing skills...',
        'Generating your report...',
      ])
    })
  })
})
