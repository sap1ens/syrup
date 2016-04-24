import _ from 'underscore';
import GitHubApi from 'github';

const possibleStoryPoints = [1, 2, 3, 4, 5];
const user = 'BenchLabs';
const teamLabel = 'team_platform';
const sprintLabelKeywords = 'Platform Sprint';

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
    token: '32386291769872a18c145e04f6c2746f112e527b'
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

function printSprint(title, issues) {
    console.log(title);

    var totalStoryPoints = 0;

    _.each(issues, (issue) => {
        const storyPoints = _.filter(_.compact(_.map(issue.labels, (label) => {
            return parseInt(label.name);
        })), (labelValue) => {
            return _.contains(possibleStoryPoints, labelValue);
        })[0];

        totalStoryPoints += storyPoints || 0;

        console.log(`Story name: ${issue.title}, points: ${storyPoints}`);
    });

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