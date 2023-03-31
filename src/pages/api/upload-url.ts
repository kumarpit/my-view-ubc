import S3 from 'aws-sdk/clients/s3'
import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const s3 = new S3({
    apiVersion: '2006-03-01',
  })

  const post = await s3.createPresignedPost({
    Bucket: process.env.BUCKET_NAME,
    Fields: {
      key: req.query.file,
      'Content-Type': req.query.fileType,
    },
    Expires: 60, // seconds
    Conditions: [
      ['content-length-range', 0, 12582912], // up to 1 MB
    ],
  })

  try {
    const client = await clientPromise;
    const db = client.db("myviewubc");
    await db.collection("uploads").insertOne({ url: `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURIComponent((req.query.file as string))}` })
  } catch (e) {
    console.log(e);
  }

  res.status(200).json(post)
}