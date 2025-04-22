import { describe, expect, it } from 'vitest'
import { parser } from '../src/app/parser.js'

describe('parser', () => {
  it('should return specifics inputs', () => {
    // JIRA:  https://hublo-team.atlassian.net/browse/HUB-25367
    // GHPR:  https://github.com/hublo/monorepo/pull/12670
    // EPH:   https://hub-25367.playground-hublo.com/hr-management
    const payload = {
      comment: { body: '/e2e' },
      issue: { number: 12_670 },
    }
    const result = parser({ payload }, 'HUB-25367')
    expect(result).toMatchInlineSnapshot(`
      {
        "branch": "HUB-25367",
        "pr": "12670",
        "url": "hub-25367",
      }
    `)
  })
})
