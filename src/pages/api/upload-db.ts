import { NextApiRequest, NextApiResponse } from "next";
import formidable from 'formidable';
import clientPromise from "../../../lib/mongodb";
import { getS3SignedUrlById } from "../../../lib/getS3SignedUrlById";
import { getPlaiceholder } from "plaiceholder";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const form = formidable()
    // use promisify instead
    const formData = new Promise<{ fields: formidable.Fields, files: formidable.Files }>((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files })
        })
    })

    try {
        const { fields } = await formData;
        console.log(fields);
        const { filename } = fields as any;
        const imgUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURIComponent(filename)}`

        const client = await clientPromise;
        const db = client.db("myviewubc");

        const url = await getS3SignedUrlById(filename);
        const { img, base64 } = await getPlaiceholder(url, { size: 20 });
        console.log(img);

        await db.collection("uploads").insertOne({ ...fields, url: imgUrl, base64 })

        return res.status(200).json({ message: "upload successful" })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "upload unsuccessful" })
    }
}

export const config = {
    api: {
      bodyParser: false
    }
  }