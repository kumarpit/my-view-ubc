import S3 from "aws-sdk/clients/s3";

export const getS3SignedUrlById = async (key: string) => {
    const s3Bucket = new S3({ params: { Bucket: process.env.BUCKET_NAME } });
    return await s3Bucket.getSignedUrl("getObject", {
        Key: key,
        Expires: 60,
    });
}