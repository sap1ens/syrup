import _ from 'underscore';
import {createLabelForRepo} from '../util/labels'
import {user, teamRepos, teamLabel, teamLabelColor, possibleStoryPoints, possibleStoryPointsColor} from '../config';

function printLabels(labels) {
    _.each(labels, (label) => {
        console.log(`Name: ${label.name}, color: ${label.color}`);
    });
}

export default function setup() {
    var labelsToCreate = [];

    labelsToCreate.push({name: teamLabel, color: teamLabelColor});

    _.each(possibleStoryPoints, (point) => {
        labelsToCreate.push({name: point.toString(), color: possibleStoryPointsColor});
    });

    console.log(`Labels to create:`);
    printLabels(labelsToCreate);

    console.log(`${teamRepos.length} repos to update`);

    _.each(teamRepos, (repo) => {
        _.each(labelsToCreate, (labelObj) => {
            createLabelForRepo(user, repo, labelObj.name, labelObj.color).then(() => {
                console.log(`${repo} updated with label ${labelObj.name}`);
            });
        });
    });
}