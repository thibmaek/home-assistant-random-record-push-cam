import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import AWS from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import contenful from 'contentful-export';

const S3 = new AWS.S3();

function sendResponse(code: number, body: string) {
  return { statusCode: code, body };
}

async function uploadToS3(fileBuffer: Buffer) {
  const params: PutObjectRequest = {
    Bucket: process.env.BUCKET_NAME,
    Key: `contentful-backups/${Date.now().toString()}.json`,
    Body: fileBuffer,
  }

  return S3.putObject(params).promise();
}

export default async function handler() {
  const exportDir = '/tmp/'
  const contentFile = 'contentful_backup.json'
  const options = {
    spaceId: process.env.SPACE_ID,
    managementToken: process.env.MANAGEMENT_TOKEN,
    contentFile,
    exportDir,
    useVerboseRenderer: false,
    saveFile: true
  };

  const exportFile = path.join(options.exportDir, options.contentFile);

  try {
    await contenful(options);

    const fileBuffer = new Buffer(fs.readFileSync(exportFile));
    await promisify(fs.unlink)(exportFile);

    await uploadToS3(fileBuffer);

    return sendResponse(200, 'Export success')!;
  } catch (error) {
    console.error('Oh no! Some errors occurred!', error);
    return sendResponse(500, `Export failed`)!;
  }
}
