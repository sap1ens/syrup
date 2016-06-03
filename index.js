import sprints from './features/list-sprints';
import newSprint from './features/new-sprint';
import cloneIssue from './features/clone-issue';
import yargsParser from 'yargs-parser';

const argv = yargsParser(process.argv.slice(2));

switch(argv.command) {
    case 'list-sprints':
        sprints();
        break;
    case 'new-sprint':
        const nameSuffix = argv.id;
        newSprint(nameSuffix);
        break;
    case 'clone-issue':
        const repo = argv.repo;
        const issueId = argv.id;
        cloneIssue(repo, issueId);
        break;
    case 'help':
    default:
        console.log(`Choose the following commands:
            npm run list-sprints - list all existing Sprints
            npm run new-sprint -- --id $SPRINT_ID - create new Sprint using unique SPRINT_ID
            npm run clone-issue -- --repo $REPO_NAME --id $ISSUE_ID - clone issue using provided repo and issue ID
            npm run help`);
}