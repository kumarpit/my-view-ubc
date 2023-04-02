import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { getS3SignedUrlById } from "../../../lib/getS3SignedUrlById";


// const encode = (data: any) => {
//     let buf = Buffer.from(data);
//     let base64 = buf.toString("base64");
//     return base64;
// }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const client = await clientPromise;
    const db = client.db("myviewubc");
    const _views = await db.collection('uploads').find().toArray();
    let views = JSON.parse(JSON.stringify(_views));

    for (const i in views) {
        const view = views[i];
        try {
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

