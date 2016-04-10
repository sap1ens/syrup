var GitHubApi = require("github");
var _ = require("underscore");
var Q = require("q");

var possibleStoryPoints = [1, 2, 3, 4, 5];
var user = "BenchLabs";
var repo = "platform";

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: false,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    pathPrefix: "", // for some GHEs; none for GitHub
    timeout: 5000,
    headers: {
        "user-agent": "syrup-app" // GitHub is happy with a unique user agent
    }
});

github.authenticate({
    type: "oauth",
    token: "32386291769872a18c145e04f6c2746f112e527b"
});

function fetchMilestones() {
    var deferred = Q.defer();

    github.issues.getAllMilestones({
        user: user,
        repo: repo,
    }, function(err, data) { 
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    });

    return deferred.promise;
}

function fetchIssuesByMiltestone(milestoneId) {
    var deferred = Q.defer();

    github.issues.repoIssues({
        user: user,
        repo: repo,
        state: "all",
        milestone: milestoneId
    }, function(err, data) { 
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    });

    return deferred.promise;
}

function printMilestone(title, issues) {
    console.log("Milestone: " + title);

    var totalStoryPoints = 0;

    _.each(issues, function(issue) {
        var storyPoints = _.filter(_.compact(_.map(issue.labels, function(label) {
            return parseInt(label.name);
        })), function(labelValue) {
            return _.contains(possibleStoryPoints, labelValue);
        })[0];

        totalStoryPoints += storyPoints || 0;

        console.log("Story name: " + issue.title + ", points: " + storyPoints);
    });

    console.log("Total points: " + totalStoryPoints + "\n");
}

fetchMilestones().then(function(milestones) {
    var milestonesIssuesAsPromises = _.map(milestones, function(milestone) {
        return fetchIssuesByMiltestone(milestone.number);
    });

    Q.all(milestonesIssuesAsPromises).then(function(milestonesIssues) {
        _.each(milestonesIssues, function(milestoneIssues, i) {
            printMilestone(milestones[i].title, milestoneIssues);
        });
    });
});

