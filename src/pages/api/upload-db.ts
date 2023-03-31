import { NextApiRequest, NextApiResponse } from "next";
import formidable from 'formidable';
import clientPromise from "../../../lib/mongodb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const form = formidable()
    const formData = new Promise<{ fields: formidable.Fields, files: formidable.Files }>((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files })
        })
    })

    try {
        const { fields } = await formData;
        const { filename } = fields as any;
        const imgUri = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURIComponent(filename)}`

        const client = await clientPromise;
        const db = client.db("myviewubc");
        await db.collection("uploads").insertOne({ ...fields, url: imgUri })

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