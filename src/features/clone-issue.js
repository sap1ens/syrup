import _ from 'underscore';
import github from '../github';
import {user} from '../config';

function fetchIssue(repo, id) {
    return new Promise((resolve, reject) => {
        github.issues.getRepoIssue({
            user: user,
            repo: repo,
            number: Number(id)
        }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function createIssue(repo, title, body, assignee, labels) {
    return new Promise((resolve, reject) => {
        github.issues.create({
            user: user,
            repo: repo,
            title: title,
            body: body,
            assignee: assignee,
            labels: labels
        }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

export default function cloneIssue(repo, issueId) {
    console.log(`Cloning issue in ${repo} repo with ID ${issueId}`);

    fetchIssue(repo, issueId).then((issue) => {
        createIssue(
            repo,
            issue.title,
            issue.body,
            issue.assignee && issue.assignee.login,
            _.map(issue.labels, (label) => label.name)
        ).then((newIssue) => {
            console.log(`New issue: ${newIssue.html_url}`);
        })
    });
}