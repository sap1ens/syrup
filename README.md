# syrup for your waffles

Scrum workflow CLI for GitHub with or without [Waffle.io](https://waffle.io). Can also be used with [ZenHub](https://www.zenhub.com). Currently only supports CLI mode.

Features:
- List all Sprints with associated issues and details
- Create new Sprint (using labels or milestones)
- Clone issue (if you decide to move it to the next Sprint)

![](https://db.tt/bxxiKMdK)

## Workflows

You can use GitHub with or without Waffle.io - in this case your workflow should be similar to what's covered in the **GitHub & Waffle.io Workflows** section.

If you use ZenHub you probably already have everything you need, but this app still can help you with milestones, check **ZenHub Workflow** section.

Also, in both cases `clone-issue` command can be helpful for moving tickets between Sprints.

## GitHub & Waffle.io Workflows

[Waffle.io](https://waffle.io) is an amazing project management tool based on GitHub. It has two-way synchronization with GitHub and shows
your issues for a repo as a Kanban board.

It's a bit tricky to use Waffle for Sprints when you connect multiple repos to one board (but this is something you'll end up doing anyway). We developed a set of rules to follow, which enables this app to show the Sprint information we need.

### Points

Waffle has its own system for points, but it's a bit weird (points like `1`, `3`, `5`, `8`, `13`...), it doesn't sync with GitHub and all points basically disappear when issue is archived. So instead, every project that participates in a Sprint **must contain** these 5 labels for story points: `1`, `2`, `3`, `4`, `5`. You can create these labels automatically for all repos using `setup` command, check **Usage** section.

### Teams

Multiple teams can work on the same repo. You **must tag** issues with a label that identifies your team. This label must be the same for all projects you track. You can define it using `project:teamLabel` config option. You can create this label automatically for all repos using `setup` command, check **Usage** section.

### Sprints

Unfortunately you can't really use milestones when you have multiple repos for the same Sprint. Also, sometimes you have to move ticket to the next Sprint, in this case you can't keep the information that ticket was initially assigned to previous Sprint.

But again, you can solve this problem with labels. Have a format like this: `[TEAM_NAME] Sprint [SPRINT_COUNTER]`, for example `Platform Sprint 10`. You can define the initial part with `project:sprintKeywords` config option, for example `Platform Sprint`.

## ZenHub Workflow

[ZenHub](https://www.zenhub.com) has almost everything that's covered here, except one thing - when you create a new Sprint you have to do it through milestones. If you have a board with multiple connected repos you'll have to create milestone manually for each one.

You can use `new-milestone` command to do it for you, it'll automatically create the same milestone (using title and due date) for all repos, so ZenHub can merge them and use as a single Sprint.

## Installation

```
npm install -g syrup-cli
```

Then create `~/.syrup/config.json` file using `config.json.example`. You need to configure the following options:

- `github:token` your GitHub token. You can use [this page](https://help.github.com/articles/creating-an-access-token-for-command-line-use/) if you don't know how to do it
- `project:user` GitHub user or organization to use for search
- `project:teamLabel` GitHub label for your team. Should be the same for all repos
- `project:sprintKeywords` Keywords for the GitHub label to mark Sprints. Check Workflow section for more info
- `project:sprintLabelColor` Color of the Sprint label, hex code without `#`
- `project:teamRepos` Array of repos names for your team (connected repos in the Waffle source settings), without organization/user. For example, specify `syrup` for `https://github.com/sap1ens/syrup` repo.

All these options can be passed as arguments or environment variables.

Here's an example of the real config I use: https://gist.github.com/sap1ens/4abf84d0726fd7abe5a5f07b17e00dc0.

## Usage

> syrup setup

Setup all team repos, create all required labels.

> syrup list-sprints

List all existing Sprints.

> syrup new-sprint -- --id SPRINT_ID

Create new Sprint using unique SPRINT_ID, it'll be used for sorting (so simple incremental number should be fine).

> syrup new-milestone --title 'MILESTONE_TITLE' --date 'DUE_DATE'

Create new milestone in every connected repo using title and due date (YYYY-MM-DD format).

> syrup clone-issue -- --repo REPO_NAME --id ISSUE_ID

Clone issue using provided repo name and issue ID.

> syrup -h

Help page.

## Development

You can use this command for iterating:

> npm run start [COMMAND] [OPTIONS]

## TODO

- Make all label colors to be configurable
- Error handling
- Tests
