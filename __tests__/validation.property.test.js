// Feature: parakh, Property 1: Whitespace-only inputs are rejected

import * as fc from 'fast-check';
import { isValidInput } from '../lib/validation.js';

/**
 * Property-based tests for input validation.
 * Validates: Requirements 1.5
 */
describe('isValidInput — Property 1: Whitespace-only inputs are rejected', () => {
  test('returns false for any all-whitespace string', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^\s+$/),
        (whitespaceStr) => {
          expect(isValidInput(whitespaceStr)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('returns true for any string containing at least one non-whitespace character', () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => s.trim().length > 0),
        (validStr) => {
          expect(isValidInput(validStr)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
