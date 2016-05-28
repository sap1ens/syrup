import _ from 'underscore';
import github from '../github';
import {user, sprintLabelKeywords, sprintLabelColor, teamRepos} from '../config';

function createLabelForRepo(repo, label, color = sprintLabelColor) {
    return new Promise((resolve, reject) => {
        github.issues.createLabel({
            user: user,
            repo: repo,
            name: label,
            color: color
        }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

export default function newSprint(id) {
    const newSprintLabel = `${sprintLabelKeywords} ${id}`;
    console.log(`New label to create: ${newSprintLabel}`);

    console.log(`${teamRepos.length} repos to update`);

    _.each(teamRepos, (repo) => {
        createLabelForRepo(repo, newSprintLabel).then(() => {
            console.log(`${repo} updated`);
        });
    });
}