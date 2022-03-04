import { getInput, setOutput, setFailed } from '@actions/core';
import { exec } from 'child_process';
import axios from 'axios';

try {

    const webhook = getInput('webhook');
    const token = getInput('token');
    const senderName = getInput('sender-name');
    const senderImage = getInput('sender-image');
    const title = getInput('title');
    const text = getInput('text');

    exec('git log -1 --format=%B', (error, stdout, stderr) => {

        let m;
        let commitsList = [];
        let regexCommit = /[^\#\#\#]*$/gm;
        // let messageCommit = stdout;
        let messageCommit = `chore(release): 1.2.4 [skip ci]

        ## [1.2.4](https://github.com/ndcmsl/ecom.customer/compare/1.2.3...1.2.4) (2022-03-01)
        
        ### Bug Fixes
        
        * correct lowercase import ([ac9168e](https://github.com/ndcmsl/ecom.customer/commit/ac9168ef8bb23c82b7a3ac69aa89ff952a58732c))
        * correct loweracase import ([ac9168e](https://github.com/ndcmsl/ecom.customer/commit/ac9168ef8bb23c82b7a3ac69aa89ff952a58732c))
        * correct loweraacase import ([ac9168e](https://github.com/ndcmsl/ecom.customer/commit/ac9168ef8bb23c82b7a3ac69aa89ff952a58732c))
        
        ### Features
        
        * correct loweraacase import ([ac9168e](https://github.com/ndcmsl/ecom.customer/commit/ac9168ef8bb23c82b7a3ac69aa89ff952a58732c))
        * correct loweraacase import ([ac9168e](https://github.com/ndcmsl/ecom.customer/commit/ac9168ef8bb23c82b7a3ac69aa89ff952a58732c))
        `;       

        while ((m = regexCommit.exec(messageCommit)) !== null) {
            if (m.index === regexCommit.lastIndex) {
                regexCommit.lastIndex++;
            }

            m.forEach((match) => {
                if (match != '')
                    commitsList.push(match);
            });
        }

        let slidesData = [];

        for (let index = 2; index < commitsList.length; index++) {

            slidesData.push(parseListToJson(commitsList[index]))

        }

        let cliqMessage = {
            text: text || '',
            bot: {
                "name": senderName || '',
                "image": senderImage || ''
            },
            card: {
                "title": title || '',
            },
            "slides": slidesData
        }

        axios.post(webhook, cliqMessage, {
            params: {
                zapikey: token,
            },
        });

        setOutput('message-json', JSON.stringify(cliqMessage));
    });

} catch (error) {
    setFailed(error.message);
}


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
                commits.push(match.replace(/\n/g, '').replace('([', '[').replace('))', ')').trim());
        });
    }
    template.title = commits[0];

    for (let index = 1; index < commits.length; index++) {
        template.data.push(commits[index]);
    }

    return JSON.stringify(template);
}
