// src/s3Service.ts
import AWS from 'aws-sdk';
import dotenv from 'dotenv';


dotenv.config(); // Load environment variables

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_BUCKET_REGION,
});


export const generateSignedUrl = async (key: string, expiresIn: number = 300): Promise<string> => {
  const bucketName = process.env.S3_BUCKET_NAME as string;

  const params = {
    Bucket: bucketName,
    Key: key, 
    Expires: expiresIn, 
    ContentType: 'application/octet-stream', 
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', params);
    return url;
  } catch (error:any) {
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
};
