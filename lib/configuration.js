const DEFAULT_POLLING_INTERVAL = 3600000
const DEFAULT_SLACK_BOT_NAME = 'Pr. Police'

const ConfigurationError = function (message, fields) {
  this.name = 'ConfigurationError'
  this.message = message
  this.fields = fields
}

ConfigurationError.prototype = Error.prototype

const parseEnvironment = function (environment) {
  return {
    tokens: {
      github: environment.GH_TOKEN,
      slack: environment.SLACK_TOKEN
    },
    polling: {
      interval: environment.CHECK_INTERVAL === undefined ? DEFAULT_POLLING_INTERVAL : parseInt(environment.CHECK_INTERVAL, 10)
    },
    projects: [
      {
        repository: {
          names: environment.GH_REPOS ? environment.GH_REPOS.split(',') : [],
          labels: environment.GH_LABELS ? environment.GH_LABELS.split(',') : []
        },
        slack: {
          channels: environment.SLACK_CHANNELS ? environment.SLACK_CHANNELS.split(',') : [],
          groups: environment.SLACK_GROUPS ? environment.SLACK_GROUPS.split(',') : [],
          bot: {
            name: environment.SLACK_BOT_NAME || DEFAULT_SLACK_BOT_NAME,
            icon: environment.SLACK_BOT_ICON
          }
        }
      }
    ]
  }
}

const validate = function (configuration) {
  const errors = {}

  if (!configuration.tokens.github) {
    errors['tokens.github'] = 'The Github token is required'
  }

  if (!configuration.tokens.slack) {
    errors['tokens.slack'] = 'The Slack token is required'
  }

  const projectErrors = configuration.projects.reduce(function (accumulator, project, index) {
    const errorPrefix = 'projects.' + index

    if (!project.repository.names.length) {
      accumulator[errorPrefix + '.repository.names'] = 'At least one repository name is required'
    }

    if (!project.slack.channels.length && !project.slack.groups.length) {
      accumulator[errorPrefix + '.slack.channels'] = 'A slack channel or group is required'
      accumulator[errorPrefix + '.slack.groups'] = 'A slack channel or group is required'
    }

    return accumulator
  }, {})

  const validationErrors = Object.assign({}, errors, projectErrors)

  return {
    valid: !Object.keys(errors).length,
    errors: validationErrors
  }
}

module.exports = {
  constants: {
    DEFAULT_POLLING_INTERVAL: DEFAULT_POLLING_INTERVAL,
    DEFAULT_SLACK_BOT_NAME: DEFAULT_SLACK_BOT_NAME
  },
  parse: function (environment) {
    const configuration = parseEnvironment(environment || {})
    const validationResult = validate(configuration)

    if (!validationResult.valid) {
      throw new ConfigurationError('The bot configuration is invalid', validationResult.errors)
    }

    return configuration
  }
}
