import got from 'got';
import $ from 'cheerio';

const images = {
  rest: 'https://ivago.be/sites/all/themes/ivago/images/fractions/HAH-REST.jpg',
  pmd: 'https://ivago.be/sites/all/themes/ivago/images/fractions/HAH-PMD.jpg',
  papier: 'https://ivago.be/sites/all/themes/ivago/images/fractions/HAH-PAPIER.jpg',
  gft: 'https://ivago.be/sites/all/themes/ivago/images/fractions/HAH-GFT.jpg',
  glas: 'https://ivago.be/sites/all/themes/ivago/images/fractions/HAH-GLAS.jpg',
}

export const handler = async (event) => {
  const baseURL = 'https://ivago.be';
  const requestURL = `${baseURL}/thuisafval/ophaling/ophaalkalender/${event.pathParameters.calendar}`;

  try {
    const nextCollectionTypes = [];

    const { body } = await got(requestURL);
    const html = body.toString();

    const nextCollectionDate = $('.volgende_ophaling_datum', html).text();
    $('.volgende_ophaling_fracties', html)
      .children()
      .map((_i, link) => {
        const imgNode = $('img', link);
        nextCollectionTypes.push(imgNode.attr('alt'));
      });

    return {
      statusCode: 200,
      body: JSON.stringify({
        nextCollectionDate,
        images,
        gft: nextCollectionTypes.includes('GFT'),
        glas: nextCollectionTypes.includes('GLAS'),
        papier: nextCollectionTypes.includes('PAPIER'),
        rest: nextCollectionTypes.includes('REST'),
        pmd: nextCollectionTypes.includes('PMD'),
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
