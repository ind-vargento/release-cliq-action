import { getInput, setOutput, setFailed } from '@actions/core';
import axios from 'axios';
const { exec } = require("child_process");

try {

    const webhook: string = getInput('webhook');
    const token: string = getInput('token');
    const senderName: string = getInput('sender-name');
    const senderImage: string = getInput('sender-image');
    const title: string = getInput('title');
    const tag: string = getInput('tag');
    const environment: string = getInput('environment');

    if (tag == 'true') {

        exec('git tag -l --sort=-creatordate | head -n 1', (error, stdout, stderr) => {

            stdout = stdout.replace('\n', '');
            let urlTemplate: string = `Cambios release [${stdout}](https://github.com/ndcmsl/${title}/releases/tag/${stdout})`;
            let cliqMessage = {
                text: urlTemplate || '',
                bot: {
                    name: senderName || '',
                    image: senderImage || ''
                },
                card: {
                    title: title || '',
                }
            };
            sendMessage(cliqMessage);

        });

    } else {

        let text: string = `Microservice deployed in ${environment}`;
        let cliqMessage = {
            text: text || '',
            bot: {
                name: senderName || '',
                image: senderImage || ''
            },
            card: {
                title: title || '',
            }
        };
        sendMessage(cliqMessage);

    }

    function sendMessage(message: any) {

        axios.post(webhook, message, {
            params: {
                zapikey: token,
            },
        });
        setOutput('message-json', JSON.stringify(message));

    }


} catch (error) {
    setFailed(error.message);
}
