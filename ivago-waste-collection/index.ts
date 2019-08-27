import got from 'got';
import $ from 'cheerio';

export const handler = async (event) => {
  const baseURL = 'https://ivago.be';
  const requestURL = `${baseURL}/thuisafval/ophaling/ophaalkalender/${event.pathParameters.calendar}`;

  try {
    const collectionTypes = [];

    const { body } = await got(requestURL);
    const html = body.toString();

    const nextCollectionDate = $('.volgende_ophaling_datum', html).text();
    $('.volgende_ophaling_fracties', html)
      .children()
      .map((_i, link) => {
        const imgNode = $('img', link);
        collectionTypes.push({
          type: imgNode.attr('alt'),
          image: `${baseURL}${imgNode.attr('src')}`,
        });
      });

    return {
      statusCode: 200,
      body: JSON.stringify({
        nextCollectionDate,
        collectionTypes,
      })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: 'Failed trying to get information from https://ivago.be',
      error,
      requestURL,
    };
  }
};
