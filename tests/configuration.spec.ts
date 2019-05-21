import { InvalidConfigurationError, parse } from '../src/configuration'

describe('parse', () => {
  it('returns a correctly parsed configuration', () => {
    const input = {
      team1: {
        executions: [
          {
            schedule: { hour: 10, minute: 0, weekdays: ['mon', 'wed'] },
            repositories: [
              { host: 'github', id: 'talkdesk/team1-repo1' },
              { host: 'github', id: 'talkdesk/team1-repo2' },
            ],
            notifications: [
              { channel: 'slack', address: '#team1' },
              { channel: 'slack', address: '#team2' },
            ],
          },
        ],
      },
    }

    const config = parse(input)

    expect(Object.assign({}, config[0])).toEqual({
      name: 'team1',
      executions: [
        {
          schedule: { hour: 10, minute: 0, weekdays: ['mon', 'wed'] },
          repositories: [
            { host: 'github', id: 'talkdesk/team1-repo1' },
            { host: 'github', id: 'talkdesk/team1-repo2' },
          ],
          notifications: [
            { channel: 'slack', address: '#team1' },
            { channel: 'slack', address: '#team2' },
          ],
        },
      ],
    })
  })

  describe("when the configuration doesn't match the schema", () => {
    it('raises an error', () => {
      const invalidInput = { test: [] }

      expect(() => parse(invalidInput)).toThrowError(InvalidConfigurationError)
    })
  })

  describe('when the schedule hour is greater than 23', () => {
    it('raises an error', () => {
      const invalidInput = {
        team1: {
          executions: [
            {
              schedule: { hour: 24, minute: 30, weekdays: [] },
              repositories: [],
              notifications: [],
            },
          ],
        },
      }

      expect(() => parse(invalidInput)).toThrowError(/hour: must have a maximum value of 23/)
    })
  })

  describe('when the schedule hour is smaller than 0', () => {
    it('raises an error', () => {
      const invalidInput = {
        team1: {
          executions: [
            {
              schedule: { hour: -1, minute: 30, weekdays: [] },
              repositories: [],
              notifications: [],
            },
          ],
        },
      }

      expect(() => parse(invalidInput)).toThrowError(/hour: must have a minimum value of 0/)
    })
  })

  describe('when the schedule minute is smaller than 0', () => {
    it('raises an error', () => {
      const invalidInput = {
        teams1: {
          executions: [
            {
              schedule: { hour: 23, minute: -1, weekdays: [] },
              repositories: [],
              notifications: [],
            },
          ],
        },
      }

      expect(() => parse(invalidInput)).toThrowError(/minute: must have a minimum value of 0/)
    })
  })

  describe('when the schedule minute is greater than 59', () => {
    it('raises an error', () => {
      const invalidInput = {
        team1: {
          executions: [
            {
              schedule: { hour: 23, minute: 60, weekdays: [] },
              repositories: [],
              notifications: [],
            },
          ],
        },
      }

      expect(() => parse(invalidInput)).toThrowError(/minute: must have a maximum value of 59/)
    })
  })

  describe('when the schedule has an invalid weekday', () => {
    it('raises an error', () => {
      const invalidInput = {
        team1: {
          executions: [
            {
              schedule: { hour: 23, minute: 0, weekdays: ['xxxx'] },
              repositories: [],
              notifications: [],
            },
          ],
        },
      }

      expect(() => parse(invalidInput)).toThrowError(/weekdays\[0\]: is not one of enum/)
    })
  })

  describe('when the repository has an invalid host', () => {
    it('raises an error', () => {
      const invalidInput = {
        team1: {
          executions: [
            {
              schedule: { hour: 23, minute: 0, weekdays: [] },
              repositories: [{ host: 'invalid', id: 'repo1' }],
              notifications: [],
            },
          ],
        },
      }

      expect(() => parse(invalidInput)).toThrowError(/host: is not one of enum values/)
    })
  })

  describe('when the notification has an invalid channel', () => {
    it('raises an error', () => {
      const invalidInput = {
        team1: {
          executions: [
            {
              schedule: { hour: 23, minute: 0, weekdays: [] },
              repositories: [],
              notifications: [{ channel: 'invalid', address: '#team' }],
            },
          ],
        },
      }

      expect(() => parse(invalidInput)).toThrowError(/channel: is not one of enum values/)
    })
  })
})
