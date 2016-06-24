import _ from 'underscore';
import github from '../github';
import {user, teamRepos} from '../config';

function createMilestoneForRepo(user, repo, title, dueOn) {
    return new Promise((resolve, reject) => {
        github.issues.createMilestone({
            user: user,
            repo: repo,
            title: title,
            due_on: dueOn
        }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

/**
 * @param name
 * @param dueDateString should have in YYYY-MM-DD format
 */
export default function newMilestone(name, dueDateString) {
    const dueOn = new Date(dueDateString).toISOString();

    console.log(`New milestone to create: ${name}, due on ${dueDateString}`);

    console.log(`${teamRepos.length} repos to update`);

    _.each(teamRepos, (repo) => {
        createMilestoneForRepo(user, repo, name, dueOn).then(() => {
            console.log(`${repo} updated`);
        });
    });
}