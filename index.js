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

function printSprint(title, issues) {
    console.log(title);

    const table = new Table({
        head: ['ID', 'Repo', 'Name', 'Points', 'Assigned to', 'Status'],
        colWidths: [10, 15, 100, 10, 25, 10]
    });

    var totalStoryPoints = 0;

    _.each(issues, (issue) => {
        const storyPoints = _.filter(_.compact(_.map(issue.labels, (label) => {
            return parseInt(label.name);
        })), (labelValue) => {
            return _.contains(possibleStoryPoints, labelValue);
        })[0];

        totalStoryPoints += storyPoints || 0;

        table.push([
            issue.number,
            extractRepoNameFromURL(issue.repository_url),
            issue.title,
            storyPoints || (isBug(issue) ? 'bug' : ''),
            issue.assignee && issue.assignee.login || '',
            issue.state]);
    });

    console.log(table.toString());

    console.log(`Total points: ${totalStoryPoints}\n`);
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


searchIssues().then((issuesData) => {
    fetchAllIssues(issuesData.items, issuesData.total_count).then((allIssuesWithTeamLabel) => {
        console.log(`Found ${allIssuesWithTeamLabel.length} issues with ${teamLabel} label`);

        const allIssuesWithSprintsLabels = _.groupBy(allIssuesWithTeamLabel, (issue) => {
            const sprintLabel = _.find(issue.labels, (label) => {
                return label.name.indexOf(sprintLabelKeywords) != -1;
            });

            return sprintLabel && sprintLabel.name;
        });

        delete allIssuesWithSprintsLabels['undefined'];

        console.log('\n');

        _.each(allIssuesWithSprintsLabels, (sprintIssues, sprintName) => {
            printSprint(sprintName, sprintIssues);
        });

    });

});