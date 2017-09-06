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

Pr. Police has the following environment variables available:

##### `DEBUG`
Debug flag used to enable more verbose logging. Default: `false`

##### `DAYS_TO_RUN`
Which days of the week to run on. Default: `Monday,Tuesday,Wednesday,Thursday,Friday`

##### `GH_TOKEN`
The github account token to access the repos. Required.

##### `SLACK_TOKEN`
The slack token for the bot to access your slack team. Required.

##### `GH_REPOS`
The list of repositories to watch. The format is `user/repo` and comma separated. Required.

Example: `rogeriopvl/gulp-ejs,rogeriopvl/pullhub,talkdesk/pr-police`

##### `GH_EXCLUDE_LABELS`
The list of labels that will cause a pull-request to be excluded. So imagine, your team uses the label `in-progress` for pull-requests not yet requiring review, you'll have to fill in: `in-progress`. Supercedes `GH_LABELS`. Multiple labels are comma separated.

Example: `do-not-merge,in-progress,needs-work`

##### `GH_LABELS`
The list of labels to filter pull-requests. So imagine, your team uses the label `needs review` for pull-requests waiting for review, you'll have to fill in: `needs review`. Multiple labels are comma separated. Optional.

NOTE: Omitting both `GH_EXCLUDE_LABELS` and `GH_LABELS` will result in _all_ open pull-requests being reported for the specified `GH_REPOS`.

##### `SLACK_CHANNELS`
The list of channel names on your team where Pr. Police will post the announcements. Multiple channels are comma separated. Either `SLACK_CHANNELS` or `SLACK_GROUPS` is required.

Example: `notifications`

##### `SLACK_GROUPS`
The list of private group names on your team where Pr. Police will post the announcements. Multiple channels are comma separated. Either `SLACK_CHANNELS` or `SLACK_GROUPS` is required.

##### `SLACK_BOT_NAME`
The name of your Pr. Police bot on slack. Optional.

##### `SLACK_BOT_ICON`
URL of the icon for the slack bot when sending messages.

##### `TIMES_TO_RUN`
What times of day to run (24-hour format, leading zeroes are not necessary). Multiple times are comma-separated. Default: `0900`.

##### `TZ`
The timezone the server should use. Heroku default is UTC. Uses tz database timezone format. Example: `America/Los_Angeles`.

## Heroku configuration

If heroku attempts to start a web process instead of a worker, you may need to run: `heroku ps:scale web=0 worker=1 -a {HEROKU_APP_NAME}`

## Credits

Pr. Police was developed by [Rogério Vicente](https://github.com/rogeriopvl) during one of Talkdesk's internal hackathons.

Artwork created by [Micaela Neto](https://cargocollective.com/micaelaneto)
