import GitHubApi from 'github';
import {config} from './config';

const github = new GitHubApi({
    // required
    version: '3.0.0',
    // optional
    debug: false,
    protocol: 'https',
    host: 'api.github.com', // should be api.github.com for GitHub
    pathPrefix: '', // for some GHEs; none for GitHub
    timeout: 5000,
    headers: {
        'user-agent': 'syrup-app' // GitHub is happy with a unique user agent
    }
});

github.authenticate({
    type: 'oauth',
    token: config.get('github:token')
});

export default github;