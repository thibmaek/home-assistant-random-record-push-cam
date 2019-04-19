const { Twitter } = require(`twitter-node-client`);
const differenceInDays = require(`date-fns/difference_in_days`);

const twitter = new Twitter({
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
});

// eslint-disable-next-line import/no-commonjs
exports.handler = (event, ctx, done) => {
  const { sys, fields } = JSON.parse(event.body);

  if (differenceInDays(new Date(), sys.createdAt) > 1) {
    return done(null, { body: `Publication date was longer than 1 day ago`, statusCode: 204 });
  }

  if (sys.contentType.sys.id === `blog-post`) {
    twitter.postTweet(
      {
        status: `
  📝 Just published something now on my blog: ${fields.title[`en-US`]}
  https://thibmaek.com/post/${fields.slug[`en-US`]}
  `,
      },
      err => done(err, { statusCode: 500 }),
      () => done(null, { statusCode: 200 }),
    );
  }

  done(null, { body: `Content Type was not a blog post`, statusCode: 422 });
};

