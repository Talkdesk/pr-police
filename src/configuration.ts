import { validate as validateSchema } from 'jsonschema'
import { ScheduleConfiguration } from './scheduleConfiguration'

enum RepositoryHost {
  GITHUB = 'github',
}

class RepositoryConfiguration {
  constructor(readonly host: RepositoryHost, readonly id: string) {}
}

enum NotificationChannel {
  SLACK = 'slack',
}

class NotificationConfiguration {
  constructor(readonly channel: NotificationChannel, readonly address: string) {}
}

class ExecutionConfiguration {
  constructor(
    readonly schedule: ScheduleConfiguration,
    readonly repositories: RepositoryConfiguration[],
    readonly notifications: NotificationConfiguration[]
  ) {}
}

class TeamConfiguration {
  constructor(readonly name: string, readonly executions: ExecutionConfiguration[]) {}
}

const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://github.com/Talkdesk/pr-police/config.schema.json',
  type: 'object',
  patternProperties: {
    '^.*$': { $ref: '#/definitions/team' },
  },
  definitions: {
    team: {
      type: 'object',
      required: ['executions'],
      properties: {
        executions: {
          type: 'array',
          items: { $ref: '#/definitions/execution' },
        },
      },
    },
    execution: {
      type: 'object',
      required: ['schedule', 'repositories', 'notifications'],
      properties: {
        schedule: { $ref: '#/definitions/schedule' },
        repositories: {
          type: 'array',
          items: { $ref: '#/definitions/repository' },
        },
        notifications: {
          type: 'array',
          items: { $ref: '#/definitions/notification' },
        },
      },
    },
    schedule: {
      type: 'object',
      required: ['hour', 'minute', 'weekdays'],
      properties: {
        hour: {
          type: 'integer',
          minimum: 0,
          maximum: 23,
        },
        minute: {
          type: 'integer',
          minimum: 0,
          maximum: 59,
        },
        weekdays: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
          },
        },
      },
    },
    repository: {
      type: 'object',
      required: ['host', 'id'],
      properties: {
        host: {
          type: 'string',
          enum: ['github'],
        },
        id: {
          type: 'string',
        },
      },
    },
    notification: {
      type: 'object',
      required: ['channel', 'address'],
      properties: {
        channel: {
          type: 'string',
          enum: ['slack'],
        },
        address: {
          type: 'string',
        },
      },
    },
  },
}

export class InvalidConfigurationError extends Error {}

const mapRepository = config => new RepositoryConfiguration(config.host, config.id)

const mapNotification = config => new NotificationConfiguration(config.channel, config.address)

const mapExecution = config => {
  const repositories = config.repositories.map(mapRepository)
  const notifications = config.notifications.map(mapNotification)
  const schedule = new ScheduleConfiguration(
    config.schedule.hour,
    config.schedule.minute,
    config.schedule.weekdays
  )

  return new ExecutionConfiguration(schedule, repositories, notifications)
}

const mapTeam = (name, config) => new TeamConfiguration(name, config.executions.map(mapExecution))

export const parse = (config): TeamConfiguration[] => {
  const validationResult = validateSchema(config, schema)

  if (!validationResult.valid) {
    const errors = validationResult.errors.map(e => `${e.property}: ${e.message}`).join('\n')

    throw new InvalidConfigurationError(
      `The configuration doesn't match the expected schema ${errors}`
    )
  }

  return Object.entries(config).map(entry => mapTeam(...entry))
}
