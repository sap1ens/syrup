import github from '../github';

export function createLabelForRepo(user, repo, label, color) {
    return new Promise((resolve, reject) => {
        github.issues.createLabel({
            user: user,
            repo: repo,
            name: label,
            color: color
        }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}