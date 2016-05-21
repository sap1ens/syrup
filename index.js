import sprints from './features/list-sprints';
import parseArgs from 'minimist';

const argv = parseArgs(process.argv.slice(2));

switch(argv.c) {
    case 'list-sprints':
        sprints();
        break;
    case 'new-sprint':
        // TODO
        const name = argv.n;
        console.log('Implement new-sprint: ' + name);
        break;
    case 'help':
    default:
        console.log(`Choose the following commands:
            npm run list-sprints - list all existing Sprints
            npm run new-sprint -- -n SPRINT_ID - create new Sprint using unique SPRINT_ID
            npm run help`);
}