import { APIGatewayEvent } from 'aws-lambda';
import got from 'got';
import $ from 'cheerio';
import { isToday, parse as parseDate, formatDistance } from 'date-fns';
import nl from 'date-fns/locale/nl';

const images = {
  rest: 'https://ivago.be/sites/all/themes/ivago/images/fractions/HAH-REST.jpg',
  pmd: 'https://ivago.be/sites/all/themes/ivago/images/fractions/HAH-PMD.jpg',
  papier: 'https://ivago.be/sites/all/themes/ivago/images/fractions/HAH-PAPIER.jpg',
  gft: 'https://ivago.be/sites/all/themes/ivago/images/fractions/HAH-GFT.jpg',
  glas: 'https://ivago.be/sites/all/themes/ivago/images/fractions/HAH-GLAS.jpg',
  grof: 'https://ivago.be/sites/all/themes/ivago/images/fractions/GROF+TEL.jpg'
}

const getDate = (nlDateString: string) => {
  const date = parseDate(nlDateString, "EEEE',' d MMMM", new Date(), { locale: nl });

  return {
    date,
    formattedDate: nlDateString,
    distance: isToday(date) ? 'Today' : formatDistance(date, new Date(), {
      addSuffix: true,
    }),
  };
}

export const handler = async (event: APIGatewayEvent) => {
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
        nextCollectionDate: getDate(nextCollectionDate),
        images,
        gft: nextCollectionTypes.includes('GFT'),
        glas: nextCollectionTypes.includes('GLAS'),
        papier: nextCollectionTypes.includes('PAPIER'),
        rest: nextCollectionTypes.includes('REST'),
        pmd: nextCollectionTypes.includes('PMD'),
        grof: nextCollectionTypes.includes('GROFVUIL OP AANVRAAG')
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
