import sprints from './features/list-sprints';
import newSprint from './features/new-sprint';
import cloneIssue from './features/clone-issue';
import program from 'commander';

program
    .command('list-sprints')
    .description('list all existing Sprints')
    .action(() => {
        sprints();
    });

program
    .command('new-sprint')
    .description('create new Sprint using unique sprint_id')
    .option('-i, --id', 'sprint ID')
    .action((id) => {
        newSprint(id);
    });

program
    .command('clone-issue')
    .description('clone issue using provided repo and issue ID')
    .option('-i, --id', 'issue ID')
    .option('-r, --repo', 'repository name')
    .action((id, repo) => {
        cloneIssue(repo, id);
    });

// kinda hacky, but there is no other way to replace the whole thing
program.helpInformation = () => {
    return 'TODO';
};

program.parse(process.argv);

if (!program.args.length) program.help();