import S3 from "aws-sdk/clients/s3";
import { NextApiRequest, NextApiResponse } from "next";

const s3 = new S3({
    apiVersion: '2006-03-01',
})

const encode = (data: any) => {
    let buf = Buffer.from(data);
    let base64 = buf.toString("base64");
    return base64;
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let params = {
        Bucket: process.env.BUCKET_NAME as string,
        Key: "c81b4228321923.563731b589b37.jpeg"
    }

    s3.getObject(params, function(err, data) {
        if (err) res.status(500).json({ message: "An error occurred" }); // an error occurred
        else  {
            // get mime type
            res.status(200).json(`data:image/jpeg;base64,${encode(data.Body)}`); 
        }
    })  
};

