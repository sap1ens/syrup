import _ from 'underscore';
import {createLabelForRepo} from '../util/labels'
import {user, sprintLabelKeywords, sprintLabelColor, teamRepos} from '../config';

export default function newSprint(id) {
    const newSprintLabel = `${sprintLabelKeywords} ${id}`;
    console.log(`New label to create: ${newSprintLabel}`);

    console.log(`${teamRepos.length} repos to update`);

    _.each(teamRepos, (repo) => {
        createLabelForRepo(user, repo, newSprintLabel, sprintLabelColor).then(() => {
            console.log(`${repo} updated`);
        });
    });
}