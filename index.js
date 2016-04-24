import _ from 'underscore';
import GitHubApi from 'github';

const possibleStoryPoints = [1, 2, 3, 4, 5];
const user = 'BenchLabs';
const repo = 'platform';

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

function fetchMilestones() {
    return new Promise((resolve, reject) => {
        github.issues.getAllMilestones({
            user: user,
            repo: repo
        }, (err, data) => {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function fetchIssuesByMiltestone(milestoneId) {
    return new Promise((resolve, reject) => {
        github.issues.repoIssues({
            user: user,
            repo: repo,
            state: 'all',
            milestone: milestoneId
        }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function printMilestone(title, issues) {
    console.log(`Milestone: ${title}`);

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

fetchMilestones().then((milestones) => {
    const milestonesIssuesAsPromises = _.map(milestones, (milestone) => {
        return fetchIssuesByMiltestone(milestone.number);
    });

    Promise.all(milestonesIssuesAsPromises).then((milestonesIssues) => {
        _.each(milestonesIssues, (milestoneIssues, i) => {
            printMilestone(milestones[i].title, milestoneIssues);
        });
    });
});

