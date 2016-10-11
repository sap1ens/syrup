import sprints from './features/list-sprints';
import newSprint from './features/new-sprint';
import newMilestone from './features/new-milestone';
import updateMilestone from './features/update-milestone';
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
    .command('new-milestone')
    .description('create new milestone in all repos using title and due date')
    .option('-t, --title', 'milestone title')
    .option('-d, --date', 'due date, YYYY-MM-DD format')
    .action((title, date) => {
        newMilestone(title, date);
    });

program
    .command('update-milestone')
    .description('update milestone due date by title')
    .option('-t, --title', 'milestone title')
    .option('-d, --date', 'due date, YYYY-MM-DD format')
    .action((title, date) => {
        updateMilestone(title, date);
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
    .option('-r, --repo', 'repository name')
    .option('-i, --id', 'issue ID')
    .action((repo, id) => {
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
     
      new-milestone  create new milestone in all repos using title and due date (YYYY-MM-DD format)
        -t, --title    milestone title
        -d, --date     due date, YYYY-MM-DD format        
     
      list-sprints   list all existing Sprints
        [no options] 
    
      clone-issue    clone issue using provided repo and issue ID
        -r, --repo     repo name
        -i, --id       issue id        
     
    Examples:
     
      $ syrup setup
      $ syrup new-sprint --id 20
      $ syrup new-milestone --title 'new sprint' --date '2016-11-04'
      $ syrup list-sprints      
      $ syrup clone-issue --id 123 --repo ops
      
    `;
};

program.parse(process.argv);

// another little hack, sorry
if (program.rawArgs.length <= 2) program.help();