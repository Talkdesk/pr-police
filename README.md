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

    yarn install

#### Run

    npm start

This will start the server locally until `Ctrl-C` is pressed.

**Note:** You will need to pass all the required env vars.

## Configuration

Pr. Police has the following environment variables available:

##### `GH_TOKEN`
The github account token to access the repos

##### `SLACK_TOKEN`
The slack token for the bot to access your slack team

#### `GH_REPOS`
The list of repositories to watch. The format is `user/repo` and comma separated.

Example: `rogeriopvl/gulp-ejs, rogeriopvl/pullhub, talkdesk/pr-police`

##### `GH_LABELS`
The list of labels to filter pull-requests. So imagine, your team uses the label `needs review` for pull-requests waiting for review, you'll have to fill in: `needs review`. Multiple labels are comma separated.

##### `SLACK_CHANNELS`
The list of channels on your team where Pr. Police will post the announcements. Multiple channels are comma separated.

##### `SLACK_GROUPS`
The list of private groups on your team where Pr. Police will post the announcements. Multiple channels are comma separated.

##### `CHECK_INTERVAL`
Time interval for announcing the pull-requests on slack. In milliseconds. Default: `3600000`.

##### `SLACK_BOT_NAME`
The name of your Pr. Police bot on slack.

## Credits

Pr. Police was developed by [Rogério Vicente](https://github.com/rogeriopvl) during one of Talkdesk's internal hackathons.

Artwork created by [Micaela Neto](https://cargocollective.com/micaelaneto)
