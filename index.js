const core = require('@actions/core');

const regexCommit = /[^\#\#\#]*$/gm;
const messageCommit = core.getInput('message-commit');
let m;

let commitsList = [];  

while ((m = regexCommit.exec(messageCommit)) !== null) {
    if (m.index === regexCommit.lastIndex) {
        regexCommit.lastIndex++;
    }
    
    m.forEach((match) => {
        if (match != '')
        commitsList.push(match);
    });
}

let slidesData = "";

for (let index = 2; index < commitsList.length; index++) {

    slidesData = slidesData + parseListToJson(commitsList[index]);
    if (index != commitsList.length - 1) {
        slidesData = slidesData + ",";
    }
}

core.setOutput("slides-data", slidesData);

function parseListToJson(list) {
    
    let regex = /[^\*]*$/gm;
    let m;
    let commits = [];

    let template = {
        type: "list",
        title: '',
        data: []
    };
    
    while ((m = regex.exec(list)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        
        m.forEach((match) => {
            if (match != '')
            commits.push(match.replace(/\n/g,'').replace('([','[').replace('))',')').trim());
        });
    }
    template.title = commits[0];

    for (let index = 1; index < commits.length; index++) {
        template.data.push(commits[index]);        
    }

    return JSON.stringify(template);
}
