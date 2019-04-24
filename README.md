# Pr. Police [![Build Status](https://travis-ci.org/Talkdesk/pr-police.svg?branch=master)](https://travis-ci.org/Talkdesk/pr-police)

![Pr. Police logo](https://raw.githubusercontent.com/Talkdesk/pr-police/master/images/logo-blue-small.png)

## About

Pr. Police is a slackbot that sends to configured slack channels a listing of open pull requests that are waiting for a review. It supports watching multiple repositories, and filtering the pull requests by label.

This project is part of the Talkdesk Hackathon April 2017.

## Running the bot

### The quick and easy way

The easiest way to get an instance of Pr. Police up and running is to deploy it to Heroku by clicking on the button below.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

You'll still need to fill in all the environment variables. For more info on this, head down to the Configuration section.


### Via NPM

    npm install pr-police

### Manually

Git clone this repository then:

    npm install

#### Run

    npm start

This will start the server locally until `Ctrl-C` is pressed.

**Note:** You will need to pass all the required env vars.

## Configuration

The application can be configured completely through environment variables or through a configuration file.

When using only environment variables, it's only possible to map a set of repositories -> set of Slack channels/groups. If you're looking for a way to have a single instance of the application triggering multiple notifications with different rules (i.e. an organization with multiple teams, each with their own rules of repositories -> notifications), you must use the configuration file.

### Environment Variables

Environment Variable | Description | Required | Example 
-------------------- | ----------- | -------- | -------
`GH_TOKEN`           | The [Github token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line) used to retrieve the PR's information from the repositories. | yes | N/A
`SLACK_TOKEN`        | The [Slack bot user token](https://get.slack.help/hc/en-us/articles/215770388-Create-and-regenerate-API-tokens#-bot-user-tokens) used to publish messages on Slack | yes | N/A
`GH_REPOS`           | A comma separated value of repositories to wach | yes, unless a configuration file is used | `rogeriopvl/gulp-ejs,rogeriopvl/pullhub,talkdesk/pr-police`
`GH_LABELS`          | The list of labels to filter pull-requests. If provided only PRs with these labels will trigger notifications | no | `needs review, pr police`
`SLACK_CHANNELS`     | The list of slack channels to where the notifications will be sent | unless a configuration file is used, either a channel or group must be set | `dev-alerts,pr-alerts`
`SLACK_GROUPS`       | The list of slack private groups to where the notifications will be sent | unless a configuration file is used, either a channel or group must be set | `dev-secret-alerts`
`CHECK_INTERVAL`     | The interval in milliseconds, between each run of the bot (each run triggers notifications) | no, defaults to 1h | `86400000`
`SLACK_BOT_NAME`     | The user name used to publish messages on Slack | no | `My Team's bot`
`SLACK_BOT_ICON`     | The icon to be used when publishing messages on Slack | no | `https://i1.sndcdn.com/avatars-000125818478-ph4tjj-t500x500.jpg`

### Configuration file

If you need a more complex project configuration format, with multiple repositories -> notification rules, you can place a `projects.json` file in the root directory of the project.

The format of the file is as follows:

```json
[
  {
    "repository": {
      "names": [
        "Talkdesk/repository-1",
        "Talkdesk/repository-2"
      ]
    },
    "slack": {
      "channels": [
        "team-1-channel",
        "general"
      ],
      "groups": [
        "secret-group"
      ],
      "bot": {
        "name": "Chuck Norris",
        "icon": "https://i1.sndcdn.com/avatars-000125818478-ph4tjj-t500x500.jpg"
      }
    }
  },
  {
    "repository": {
      "names": [
        "Talkdesk/repository-3"
      ],
      "labels": [
        "needs review"
      ]
    },
    "slack": {
      "channels": [
        "team-2-channel"
      ],
      "bot": {
        "name": "Harry Potter",
        "icon": "https://lh3.googleusercontent.com/0duXs46FK54NZtOAnXbqv5xcpz0NCf7JE34ITfYZhGS2eiPWd11l9FzaJNEnny1K1Fatz2oE2HENKahpPQ"
      }
    }
  }
]
```

With the configuration above:

1. Any PR on `Talkdesk/repository-1` and `Talkdesk/repository-2` will trigger a notification to the channels `team-channel-1`, `general` and to the group `secret-group` (using a Chuck Norris persona)

2. Any PR with a label `needs review` on the repository `Talkdesk/repository-3` will trigger a notification to the channel `team-2-channel` (using a Harry Potter persona)


## Credits

Pr. Police was developed by [Rogério Vicente](https://github.com/rogeriopvl) during one of Talkdesk's internal hackathons.

Artwork created by [Micaela Neto](https://cargocollective.com/micaelaneto)
