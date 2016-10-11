import _ from 'underscore';
import github from '../github';
import {user, teamRepos} from '../config';

/**
 * Updates title and due date by ID (number)
 *
 * @param user
 * @param repo
 * @param id
 * @param title
 * @param newDueOn
 * @returns {Promise}
 */
function updateMilestoneById(user, repo, id, title, newDueOn) {
    return new Promise((resolve, reject) => {
        github.issues.updateMilestone({
            user: user,
            repo: repo,
            number: id,
            title: title,
            due_on: newDueOn
        }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function getMilestones(user, repo) {
    return new Promise((resolve, reject) => {
        github.issues.getAllMilestones({
            user: user,
            repo: repo
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
export default function updateMilestone(name, dueDateString) {
    const dueOn = new Date(dueDateString).toISOString().slice(0, -5) + 'Z'; // GitHub API doesn't like milliseconds here :-/

    console.log(`Milestone to update: ${name}, due on ${dueOn}`);

    console.log(`${teamRepos.length} repos to update`);

    _.each(teamRepos, (repo) => {
        getMilestones(user, repo).then((milestones) => {
            const milestone = _.findWhere(milestones, {title: name});

            if(milestone) {
                updateMilestoneById(user, repo, milestone.number, name, dueOn).then(() => {
                    console.log(`${repo} updated`);
                });
            }
        });
    });
}