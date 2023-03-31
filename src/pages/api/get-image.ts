import S3 from "aws-sdk/clients/s3";
import { NextApiRequest, NextApiResponse } from "next";

const s3 = new S3({
    apiVersion: '2006-03-01',
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let params = {
        Bucket: process.env.BUCKET_NAME as string,
        Key: "c81b4228321923.563731b589b37.jpeg"
    }

    s3.getObject(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data); 
    })  
};

