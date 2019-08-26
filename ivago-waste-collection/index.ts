import got from 'got';
import { parse } from 'node-html-parser';

export const handler = async (event) => {
  try {
    const { body } = await got(`https://ivago.be/thuisafval/ophaling/ophaalkalender/${event.pathParameters.calendar}`);
    const HTMLContents = parse(body.toString());
    // @ts-ignore
    const node = HTMLContents.querySelector('.volgende_ophaling')
    node.childNodes.forEach(child => {
      console.log(child.childNodes);
    })

    return {
      statusCode: 200,
      body: JSON.stringify({})
    };
  } catch (error) {
    throw error;
  }
};
