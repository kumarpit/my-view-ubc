import S3 from "aws-sdk/clients/s3";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";


const encode = (data: any) => {
    let buf = Buffer.from(data);
    let base64 = buf.toString("base64");
    return base64;
}

const getS3SignedUrlById = async (key: string) => {
    const s3Bucket = new S3({ params: { Bucket: process.env.BUCKET_NAME } });
    return await s3Bucket.getSignedUrl("getObject", {
        Key: key,
        Expires: 60,
    });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const client = await clientPromise;
    const db = client.db("myviewubc");
    const _views = await db.collection('uploads').find().toArray();
    let views = JSON.parse(JSON.stringify(_views));

    // let params = {
    //     Bucket: process.env.BUCKET_NAME as string,
    //     Key: ""
    // }

    for (const i in views) {
        const view = views[i];
        try {
            // const data = await s3.getObject(params).promise();
            // views[i] = {
            //     ...views[i],
            //     data: `data:${view.filetype};base64,${encode(data.Body)}`
            // }
            views[i] = {
                ...views[i],
                data: await getS3SignedUrlById(view.filename)
            }
        } catch (err) {
            return res.status(500).json({ message: "An error occurred" })
        }
            
    }  

    res.status(200).json(views);
};

