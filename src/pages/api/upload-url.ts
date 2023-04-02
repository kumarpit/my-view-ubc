import { NextApiRequest, NextApiResponse } from 'next'
import busboy from 'busboy';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export const config = {
  api: {
    bodyParser: false
  }
}

const s3 = new S3Client({ region: process.env.AWS_REGION });

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadFile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bb = busboy({ headers: req.headers });
  bb.on('file', async (_, file, info) => {
    const filename = info.filename;

    try {
      const parallelUploads = new Upload({
        client: s3,
        queueSize: 4,
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false,
        params: {
          Bucket: process.env.BUCKET_NAME,
          Key: filename,
          Body: file
        }
      })
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "couldn't upload" })
    }
  })

  bb.on('close', () => {
    res.writeHead(200, { Connection: "close" })
    res.end('File uploaded')
  })

  req.pipe(bb);
  return;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  switch(method) {
    case "POST":
      return uploadFile(req, res);
  }
}