
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from 'uniqid';

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRERT_ACCESS_KEY;
const BucketName = process.env.BUCKET_NAME;

export async function POST(req){
    const formData = await req.formData();
    const file = formData.get('file');
   const {name,type} = file;
   
const data = await file.arrayBuffer();

   const s3client = new S3Client({
    region:'eu-north-1',
    credentials:{
        accessKeyId,
        secretAccessKey
    }
   })

const id = uniqid();
const extension = name.split('.').slice(-1);
const nweName = id +'.'+ extension;

   const uploadCommand = new PutObjectCommand({
    Bucket:BucketName,
    Body:data,
    ACL:'public-read',
    ContentType:type,
    Key:nweName
   })

 await s3client.send(uploadCommand);

   return Response.json({name,extension,nweName,id});
}