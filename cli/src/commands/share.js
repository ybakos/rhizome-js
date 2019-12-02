const { Command, flags } = require('@oclif/command');
const PFMCreator = require('../../../bin/invoke');

const getInput = async (question) => {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((reject, resolve) => {
    readline.question(question, async (input) => {
      readline.close();
      resolve(input);
    });
  });
};

class ShareCommand extends Command {
  async run() {
    const {flags} = this.parse(ShareCommand);
    // const PFM = await PFMCreator();
    const message = flags.name || await getInput('Data: ');
    console.log(message)
    // const uploadedMessage = PFM.upload(message);
  }
}

ShareCommand.description = `Share text-based information with your cohorts.`

ShareCommand.flags = {
  name: flags.string({
    char: 'm', description: 'Message to send.'
  }),
  tags: flags.string({
    char: 't', description: 'Tags to add.'
  })
}

module.exports = ShareCommand
