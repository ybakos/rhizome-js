# Rhizome

**To run from scratch:** 

Install NVM

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash`


Install Node 11+ then set NVM to use it:

`nvm install 11`

`nvm use 11`


Clone the repo

`git clone git@github.com:scmilee/rhizome.git`


**IPFS is required since the dameon-ctl tool creates new keys each run.**


Visit: https://docs.ipfs.io/guides/guides/install/


Once installed and working, run the following commands:


Create your keys.

`ipfs init`


Start the daemon.

`ipfs daemon`


Install the packages for the project.

`npm install`


Run the dev TUI

`npm run tui`
