import { getInput, setOutput, setFailed } from '@actions/core';
import { exec } from 'child_process';
import axios from 'axios';

try {

    const webhook = getInput('webhook');
    const token = getInput('token');
    const senderName = getInput('sender-name');
    const senderImage = getInput('sender-image');
    const title = getInput('title');

    exec('git tag -l --sort=-creatordate | head -n 1', (error, stdout, stderr) => {

        stdout = stdout.replace('\n','');
        let urlTemplate = `Cambios release [${stdout}](https://github.com/ndcmsl/${title}/releases/tag/${stdout})`

        let cliqMessage = {
            text: urlTemplate || '',
            bot: {
                "name": senderName || '',
                "image": senderImage || ''
            },
            card: {
                "title": title || '',
            }
        }

        axios.post(webhook, cliqMessage, {
            params: {
                zapikey: token,
            },
        });

        setOutput('message-json', JSON.stringify(cliqMessage));
        setOutput('command', JSON.stringify(stdout));
    });

} catch (error) {
    setFailed(error.message);
}
