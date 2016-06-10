import sprints from './features/list-sprints';
import newSprint from './features/new-sprint';
import cloneIssue from './features/clone-issue';
import setup from './features/setup';
import program from 'commander';

program
    .command('setup')
    .description('setup all team repos with required labels')
    .action(() => {
        setup();
    });

program
    .command('new-sprint')
    .description('create new Sprint using unique sprint ID')
    .option('-i, --id', 'sprint ID')
    .action((id) => {
        newSprint(id);
    });

program
    .command('list-sprints')
    .description('list all existing Sprints')
    .action(() => {
        sprints();
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
    return `
    Usage: syrup command [options]
     
    Commands:
     
      setup          setup all team repos with required labels
        [no options]     
     
      new-sprint     create new Sprint using unique sprint ID
        -i, --id       sprint id     
     
      list-sprints   list all existing Sprints
        [no options] 
    
      clone-issue    clone issue using provided repo and issue ID
        -i, --id       issue id
        -r, --repo     repo name
     
    Examples:
     
      $ syrup setup
      $ syrup new-sprint --id 20
      $ syrup list-sprints      
      $ syrup clone-issue --id 123 --repo ops
      
    `;
};

program.parse(process.argv);

// another little hack, sorry
if (program.rawArgs.length <= 2) program.help();