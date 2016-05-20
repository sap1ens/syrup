import nconf from 'nconf';

nconf.env().argv();
nconf.file('config.json');

export const possibleStoryPoints = [1, 2, 3, 4, 5];
export const user = nconf.get('project:user');
export const teamLabel = nconf.get('project:teamLabel');
export const sprintLabelKeywords = nconf.get('project:sprintKeywords');

export const config = nconf;