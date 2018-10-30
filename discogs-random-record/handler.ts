import DiscoJs from 'discojs';
import * as got from 'got';
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import pickRandom from 'pure-fun/esm/arrays/pickRandom';

import { getPageURL, getRandomPage } from './utils/';

const client = new DiscoJs({ userToken: process.env.DISCOGS_API_TOKEN });

export const getRandomRecord: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {
  try {
    const { username } = await client.getIdentity();
    const { folders } = await client.listFoldersForUser(username);
    const { id } = folders.find(folder => folder.name === "All");
    const { pagination } = await client.getItemsInFolderForUser(username, id);

    const randomPage = getRandomPage(pagination.page, pagination.pages);

    const url = getPageURL(pagination.urls.last, randomPage);

    const { body } = await got(url);
    const randomRecord = pickRandom(JSON.parse(body).releases);

    return cb(null, {
      statusCode: 200,
      body: JSON.stringify({
        record: randomRecord,
        url,
      }),
    });
  } catch (error) {
    return cb({
      message: error.toString(),
      name: "Fetch error",
    });
  }
}
