import nconf from 'nconf';
import os from 'os';

nconf.env().argv();
nconf.file(os.homedir() + '/.syrup/config.json');

export const possibleStoryPoints = [1, 2, 3, 4, 5];
export const user = nconf.get('project:user');
export const teamLabel = nconf.get('project:teamLabel');
export const sprintLabelKeywords = nconf.get('project:sprintKeywords');
export const sprintLabelColor = nconf.get('project:sprintLabelColor');
export const teamRepos = nconf.get('project:teamRepos');

export const config = nconf;