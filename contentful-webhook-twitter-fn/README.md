Simple example of a cloud function to which tweets whenever a new entry gets published on Contentful.
Set a contentful webhook to point to the function url and voila:

![screenshot](https://res.cloudinary.com/thibault-maekelbergh/image/upload/c_scale,w_664/v1537129011/Screen_Shot_2018-09-16_at_22.15.27_pkodn6.png)

# How

It checks if the content type is equal to 'blog-post'. If the post's creation date is longer than one day ago it will not trigger since making edits and saving them in Contentful requires to republish the article which would retrigger the cloud function and send out a new tweet.

# Usage

Twitter credentials will be added as an env variable trough serverless.
Define a `config.<stage>.js` file where stage is one of 'dev' or 'prod'.

The dev config is already added and you can copy it over as config.prod.js and fill in details to deploy the function quickly

```json
{
  "TWITTER_ACCESS_TOKEN_SECRET": "",
  "TWITTER_ACCESS_TOKEN": "",
  "TWITTER_CONSUMER_KEY": "",
  "TWITTER_CONSUMER_SECRET": ""
}
```

## Testing offline

serverless-offline is added as a plugin to mock the lambda locally. Install all dependencies and run:

```console
$ npm start
> sls offline --stage dev

Serverless: Starting Offline: dev/us-east-1.

Serverless: Routes for contentful_webhook_twitter:
Serverless: POST /

Serverless: Offline listening on http://localhost:3000
```

To test you can then send a post request to the address listed in ouput. Contentful sends a lot over in the webhook call but this is the minimum of required data:

```json
{
  "sys": {
    "createdAt": "2018-09-16T20:25:32.024Z",
    "contentType": {
      "sys": {
        "id": "blog-post"
      }
    }
  },
  "fields": {
    "title": {
      "en-US": "Example title of a blogpost"
    },
    "slug": {
      "en-US": "some-post"
    }
  }
}
```

# Deploy

```console
$ npm run deploy
>   sls deploy --stage prod
```
