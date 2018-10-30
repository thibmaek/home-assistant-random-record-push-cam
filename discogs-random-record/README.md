This package is a simple cloud function which uses [discojs](https://www.npmjs.com/package/discojs) to grab your Discogs collection and return a random record in the response.

# Installing

1. `npm install`
2. Create `env.json` and add a key `DISCOGS_API_TOKEN` with your token in it.
3. `npm run deploy:prod`
4. If you want to test locally use `npm start` to get the response locally before deploying it to AWS
