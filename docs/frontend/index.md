[← Return to homepage](../)

# Crowd Captions - Frontend Documentation

If you'd like to develop on Frontend, follow the instructions below. By default, you'll also need to set up Backend to run at the same time, as the development version of the chrome extention will look for the API at http://localhost:8000/

# Get Started

## Install dependencies

- Install [NodeJS 14.17.6 LTS (or similar)](https://nodejs.org/)
- Install [Yarn](https://yarnpkg.com/)
- run `yarn install`

## Configure

Configure the Crowd Captions API endpoint you want to use by editing the .env file:

    VUE_APP_BACKEND_HOST = "https://api.domain.here"

By default this will be `http://localhost:8000`, but you can change this to any other host you want.

Configure the `manifest.json`file to include the API endpoint(s) you use in testing and production, as well as the Panopto domains you wish to use (eg `https://auckland.au.panopto.com`).

## Launch server

Start up the server:

- `yarn serve`

Finally, install the chrome extention:

- Go to chrome://extensions/, ensure developer mode is enabled, then click "Load unpacked extension" and select the `dist` folder within this project to install it.
- Visit a [Panopto Recording](https://aucklandtest.au.panopto.com/Panopto/Pages/Viewer.aspx?id=17f5f2e4-3252-44e5-a32e-adcc002772d7) to test it out
