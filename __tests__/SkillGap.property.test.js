// Feature: careershield-ai, Property 8: Missing skills are highlighted in red, present skills are not

import * as fc from 'fast-check'
import { render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import SkillGap from '../components/SkillGap.jsx'

/**
 * Validates: Requirements 7.2
 *
 * Property 8: Missing skills are highlighted in red, present skills are not
 *
 * For any combination of `required_skills` and `missing_skills` arrays
 * (where `missing_skills` is a subset of `required_skills`):
 *   - Every skill in `missing_skills` SHALL be rendered with color #dc2626
 *     (rgb(220, 38, 38) in JSDOM) in the "Job requires" column.
 *   - Every skill in `required_skills` that is NOT in `missing_skills`
 *     SHALL NOT receive the red color treatment.
 *   - When `missing_skills` is empty, NO skill SHALL receive the red color treatment.
 */

describe('SkillGap — Property 8: Missing skills highlighted in red, present skills not', () => {
  // ── Property-based test ────────────────────────────────────────────────────

  test('missing skills have red color, non-missing skills do not', () => {
    fc.assert(
      fc.property(
        // Generate an array of non-empty, non-whitespace-only skill strings;
        // derive missing_skills as a random subset
        fc
          .array(
            fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
            { minLength: 0, maxLength: 10 }
          )
          .chain((arr) => fc.subarray(arr).map((sub) => ({ arr, sub }))),
        ({ arr: required_skills, sub: missing_skills }) => {
          const { container, unmount } = render(
            <SkillGap
              student_skills={[]}
              required_skills={required_skills}
              missing_skills={missing_skills}
              recommended_projects={[]}
            />
          )

          if (required_skills.length === 0) {
            // No list items to check when there are no required skills
            unmount()
            return
          }

          // Scope all queries to `container` to avoid cross-render interference
          // Find the "Job requires" heading within this render's container
          const jobRequiresHeadings = within(container).getAllByText(/job requires/i)
          // There's exactly one "Job requires" heading per SkillGap render
          const jobRequiresHeading = jobRequiresHeadings[0]

          // The "Job requires" column is the closest parent <div> of the heading
          const jobRequiresColumn = jobRequiresHeading.closest('div')

          // Get all <li> elements inside the "Job requires" column, in order
          const listItems = within(jobRequiresColumn).getAllByRole('listitem')

          // The <li> elements map 1:1 with required_skills by index
          expect(listItems).toHaveLength(required_skills.length)

          const missingSet = new Set(missing_skills)

          required_skills.forEach((skill, idx) => {
            const li = listItems[idx]
            if (missingSet.has(skill)) {
              // Missing skill: the <li> must have the red inline color
              expect(li.style.color).toBe('rgb(220, 38, 38)')
            } else {
              // Non-missing skill: the <li> must NOT have the red inline color
              expect(li.style.color).not.toBe('rgb(220, 38, 38)')
            }
          })

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  // ── Example-based tests ────────────────────────────────────────────────────

  describe('empty required_skills — no list items rendered', () => {
    test('renders "No requirements listed." placeholder and no list items', () => {
      render(
        <SkillGap
          student_skills={[]}
          required_skills={[]}
          missing_skills={[]}
          recommended_projects={[]}
        />
      )
      expect(screen.getByText(/no requirements listed/i)).toBeInTheDocument()
      // No listitem elements in the Job requires column
      const jobRequiresHeading = screen.getByText(/job requires/i)
      const jobRequiresColumn = jobRequiresHeading.closest('div')
      expect(within(jobRequiresColumn).queryAllByRole('listitem')).toHaveLength(0)
    })
  })

  describe('empty missing_skills — no red highlighting', () => {
    test('no skill in the Job requires column is red when missing_skills is empty', () => {
      const skills = ['React', 'Node.js', 'SQL']
      render(
        <SkillGap
          student_skills={[]}
          required_skills={skills}
          missing_skills={[]}
          recommended_projects={[]}
        />
      )
      const jobRequiresHeading = screen.getByText(/job requires/i)
      const jobRequiresColumn = jobRequiresHeading.closest('div')
      const listItems = within(jobRequiresColumn).getAllByRole('listitem')
      for (const li of listItems) {
        expect(li.style.color).not.toBe('rgb(220, 38, 38)')
      }
    })
  })

  describe('all skills are missing — all are red', () => {
    test('every skill in the Job requires column is red when all are missing', () => {
      const skills = ['Python', 'Docker', 'Kubernetes']
      render(
        <SkillGap
          student_skills={[]}
          required_skills={skills}
          missing_skills={skills}
          recommended_projects={[]}
        />
      )
      const jobRequiresHeading = screen.getByText(/job requires/i)
      const jobRequiresColumn = jobRequiresHeading.closest('div')
      const listItems = within(jobRequiresColumn).getAllByRole('listitem')
      expect(listItems).toHaveLength(3)
      for (const li of listItems) {
        expect(li.style.color).toBe('rgb(220, 38, 38)')
      }
    })
  })

  describe('partial missing_skills — mixed red and non-red', () => {
    test('only missing skills are red, present skills are not', () => {
      const required = ['Java', 'Spring', 'SQL', 'AWS', 'Git']
      const missing = ['SQL', 'AWS']
      render(
        <SkillGap
          student_skills={['Java', 'Spring', 'Git']}
          required_skills={required}
          missing_skills={missing}
          recommended_projects={[]}
        />
      )
      const jobRequiresHeading = screen.getByText(/job requires/i)
      const jobRequiresColumn = jobRequiresHeading.closest('div')
      const listItems = within(jobRequiresColumn).getAllByRole('listitem')
      const missingSet = new Set(missing)

      for (const li of listItems) {
        const text = li.textContent.trim()
        if (missingSet.has(text)) {
          expect(li.style.color).toBe('rgb(220, 38, 38)')
        } else {
          expect(li.style.color).not.toBe('rgb(220, 38, 38)')
        }
      }
    })
  })

  describe('single missing skill', () => {
    test('exactly one skill is red when only one is missing', () => {
      const required = ['TypeScript', 'GraphQL', 'PostgreSQL']
      const missing = ['GraphQL']
      render(
        <SkillGap
          student_skills={[]}
          required_skills={required}
          missing_skills={missing}
          recommended_projects={[]}
        />
      )
      const jobRequiresHeading = screen.getByText(/job requires/i)
      const jobRequiresColumn = jobRequiresHeading.closest('div')
      const listItems = within(jobRequiresColumn).getAllByRole('listitem')
      const redItems = listItems.filter((li) => li.style.color === 'rgb(220, 38, 38)')
      expect(redItems).toHaveLength(1)
      expect(redItems[0].textContent.trim()).toBe('GraphQL')
    })
  })
})
