## Getting Started

### Getting authenticated

To allow this tool to authenticate with the Panopto API, you'll need to create an administrator user. We reccomend you make one specifically for this tool, which will help isolate anything the API does within Panopto.

Once you've made a user, you'll need a client ID and Secret. To do that, follow the instructions here: https://support.panopto.com/s/article/support-panopto-com-s-article-oauth2-client-setup. You want to create an API Key with the type "User Based Server Application".

Once you have the client ID and secret, create a `.env` file, and fill it with your credentials and the URL of your hosted Panopto server:

```
panopto_host=https://xxx.xxx.panopto.com
panopto_username=xxx
panopto_password=xxx
panopto_clientId=xxx
panopto_clientSecret=xxx
```

This should be enough to have things spin up and work in development, so let's move on to:

### Running the project

To start developing, grab your OS-specific version of [Docker](https://www.docker.com/get-started). Then:

1. Open up a terminal in the root directory of the project
2. Run `docker-compose up`

Everything should download and configure automatically. Confirm things are working by visiting http://localhost:8000/. If you see "received on port: 8000", you're good to go.

If you'd like to run this detached from your current terminal, just use `docker-compose up -d` instead.

**Note: if you at any point change the package.json or if you need (or want) to rebuild from scratch, use `docker-compose down -v --rmi all` to remove everything, before running `docker-compose up` again.**


## Testing the project

Think you're ready to submit a pull request? First, make sure your code passes all of the tests. This is also a good time to update any tests that need it, and to create/remove new and redundant tests. To test the project, run:

```
docker-compose run backend npm test
```

## Running in production

```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## Stack

- NodeJS with Express