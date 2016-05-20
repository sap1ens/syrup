import _ from 'underscore';
import GitHubApi from 'github';
import Table from 'cli-table';
import nconf from 'nconf';

nconf.env().argv();
nconf.file('config.json');

const possibleStoryPoints = [1, 2, 3, 4, 5];
const user = nconf.get('project:user');
const teamLabel = nconf.get('project:teamLabel');
const sprintLabelKeywords = nconf.get('project:sprintKeywords');

const github = new GitHubApi({
    // required
    version: '3.0.0',
    // optional
    debug: false,
    protocol: 'https',
    host: 'api.github.com', // should be api.github.com for GitHub
    pathPrefix: '', // for some GHEs; none for GitHub
    timeout: 5000,
    headers: {
        'user-agent': 'syrup-app' // GitHub is happy with a unique user agent
    }
});

github.authenticate({
    type: 'oauth',
    token: nconf.get('github:token')
});

function searchIssues(page = 1) {
    const query = `user:${user}+label:${teamLabel}`;

    console.log(`Using search query: "${query}", fetching page ${page}`);

    return new Promise((resolve, reject) => {
        github.search.issues({
            q: query,
            sort: 'created',
            per_page: 100,
            page: page
        }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function isBug(issue) {
    return _.find(issue.labels, (label) => label.name == 'bug')
}

// TODO: improve, kinda hacky now
function extractRepoNameFromURL(url) {
    return url.replace(`https://api.github.com/repos/${user}/`, '');
}

function orderObject(unorderedObj) {
    const ordered = {};

    Object.keys(unorderedObj).sort().forEach(function(key) {
      ordered[key] = unorderedObj[key];
    });

    return ordered;
}

function printSprint(title, issues) {
    console.log(title);

    const table = new Table({
        head: ['ID', 'Repo', 'Name', 'Points', 'Assigned to', 'Status'],
        colWidths: [10, 20, 100, 10, 25, 10]
    });

    var totalStoryPoints = 0;
    var assignees = new Set();

    _.each(issues, (issue) => {
        const storyPoints = _.filter(_.compact(_.map(issue.labels, (label) => {
            return parseInt(label.name);
        })), (labelValue) => {
            return _.contains(possibleStoryPoints, labelValue);
        })[0];

        totalStoryPoints += storyPoints || 0;

        const assignee = issue.assignee && issue.assignee.login;
        if(assignee) assignees.add(assignee);

        table.push([
            issue.number,
            extractRepoNameFromURL(issue.repository_url),
            issue.title,
            storyPoints || (isBug(issue) ? 'bug' : ''),
            assignee || '',
            issue.state]);
    });

    console.log(table.toString());

    console.log(`Total points: ${totalStoryPoints}`);
    console.log(`Total number of assignees: ${assignees.size}`);
    console.log(`Points per assignee: ${Math.round(totalStoryPoints / assignees.size)}\n`);
}

function fetchAllIssues(initialData = [], totalCount, startFrom = 2) {
    return new Promise((resolve, reject) => {
        var allIssuesWithLabel = initialData;

        function fetchAll(page) {
            if(allIssuesWithLabel.length < totalCount) {
                searchIssues(page).then((moreData) => {
                    allIssuesWithLabel = _.union(allIssuesWithLabel, moreData.items);
                    fetchAll(page + 1);
                });
            } else {
                resolve(allIssuesWithLabel);
            }
        }

        fetchAll(startFrom);
    });
}

function isSprintLabel(labelName) {
    return labelName.indexOf(sprintLabelKeywords) != -1;
}


searchIssues().then((issuesData) => {
    fetchAllIssues(issuesData.items, issuesData.total_count).then((allIssuesWithTeamLabel) => {
        console.log(`Found ${allIssuesWithTeamLabel.length} issues with ${teamLabel} label`);

        var allIssuesWithSprintsLabels = {};

        _.each(allIssuesWithTeamLabel, (issue) => {
            _.each(issue.labels, (label) => {
                var name = label.name;

                 if(isSprintLabel(name)) {
                     if(_.isUndefined(allIssuesWithSprintsLabels[name])) {
                         allIssuesWithSprintsLabels[name] = [];
                     }

                     allIssuesWithSprintsLabels[name].push(issue);
                 }
            });
        });

        console.log('\n');

        allIssuesWithSprintsLabels = orderObject(allIssuesWithSprintsLabels);

        _.each(allIssuesWithSprintsLabels, (sprintIssues, sprintName) => {
            printSprint(sprintName, sprintIssues);
        });

    });

});