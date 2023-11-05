import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { GetTranscriptionJobCommand, StartTranscriptionJobCommand, TranscribeClient } from "@aws-sdk/client-transcribe";
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRERT_ACCESS_KEY;
const BucketName = process.env.BUCKET_NAME;


function getClient() {
    return new TranscribeClient({
        region: 'eu-north-1',
        credentials: {
            accessKeyId,
            secretAccessKey
        }
    })
}

async function streamToString(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {

        stream.on('data', chunk => {
            chunks.push(Buffer.from(chunk))
        })

        stream.on('end', () => {
            resolve(Buffer.concat(chunks).toString('utf8'))
        })

        stream.on('error', reject);
    })

}

async function getTranscriptionFile(fileName) {
    const transcriptionFile = fileName + '.transcription';

    const s3client = new S3Client({
        region: 'eu-north-1',
        credentials: {
            accessKeyId,
            secretAccessKey
        }
    })

    const getObjectCommand = new GetObjectCommand({
        Bucket: BucketName,
        Key: transcriptionFile,
    })

    let transcribedFileRespnse = null
    try {
        transcribedFileRespnse = await s3client.send(getObjectCommand);
        if (transcribedFileRespnse) {

            return JSON.parse(await streamToString(transcribedFileRespnse.Body));
           
            
        }
        return null;
        
    } catch (e) {

    }


}



export async function GET(req) {


    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const fileName = searchParams.get('filename');

    const transcribeClient = getClient();







    const transcription = await getTranscriptionFile(fileName);

    if(transcription){
        return Response.json({
            status:'CoMPLETED',
            transcription
        })
    }


    const trnscribeJobStatusCommand = new GetTranscriptionJobCommand({
        TranscriptionJobName: fileName,
    })

    




    let existingJob = false;
    try {
        const jobStatus = await transcribeClient.send(trnscribeJobStatusCommand);
        existingJob = true;
        
        if (existingJob) {
            return Response.json({
                status: jobStatus.TranscriptionJob.TranscriptionJobStatus,
            })
        }

    } catch (error) {

    }

    console.log({ existingJob });
    


    if (!existingJob) {

        const transcriptionCommand = new StartTranscriptionJobCommand({
            TranscriptionJobName: fileName,
            OutputBucketName: BucketName,
            OutputKey: fileName + '.transcription',
            IdentifyLanguage: true,
            Media: {
                MediaFileUri: 's3://' + BucketName + '/' + fileName,
            },
        })

        const result = await transcribeClient.send(transcriptionCommand);

        return Response.json({
            status: result.TranscriptionJob.TranscriptionJobStatus,
        })

    }


    return Response.json(false);
}