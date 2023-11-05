"use client"

import { transcriptionItemsToSrt } from "@/lib/srt";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useEffect, useRef, useState } from "react";

import robotoBold from './../subtitleFont/Roboto-Bold.ttf';




export default function ResultVideo({ fileName, transcribedItems }) {

    const videoUrl = "https://udai-captions.s3.amazonaws.com/" + fileName;
    const [loaded, setLoaded] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef(null);

    const [disableBtn, setDisableBtn] = useState(false);

    const [progress, setProgress] = useState(1);


    useEffect(() => {

        videoRef.current.src = videoUrl;
        load();
    }, [])


    const load = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd'
        const ffmpeg = ffmpegRef.current;


        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });

        ffmpeg.writeFile('/tmp/roboto-bold.ttf', await fetchFile(robotoBold))
        setLoaded(true);
    }


    const transcode = async () => {

        setDisableBtn(true);

        const srt = transcriptionItemsToSrt(transcribedItems);
        const ffmpeg = ffmpegRef.current;
        await ffmpeg.writeFile(fileName, await fetchFile(videoUrl));
        await ffmpeg.writeFile('subs.srt', srt);

        videoRef.current.src = videoUrl;

        await new Promise((resolve, reject) => {
            videoRef.current.onloadedmetadata = resolve;
        });

        const duration = videoRef.current.duration;
        console.log({ duration });

        ffmpeg.on('log', ({ message }) => {

            const regexResult = /time=([0-9:.]+)/.exec(message)
            if (regexResult && regexResult?.[1]) {
                const howMuchIsdONE = regexResult?.[1];
                const [hours, minuites, seconds] = howMuchIsdONE.split(':');
                const doneTotalSeconds = hours * 3600 + minuites * 60 + seconds;
                const videoProgress = doneTotalSeconds / duration;
                setProgress(videoProgress);
            }
        });



        await ffmpeg.exec([
            '-i', fileName,
            '-preset', 'ultrafast',
            '-vf', `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=Roboto Bold,FontSize=20,MarginV=40 `,
            'output.mp4'
        ]);


        const data = await ffmpeg.readFile('output.mp4');
        videoRef.current.src =
            URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

        setProgress(1);
        setDisableBtn(false);
    }



    return (
        <div className="md:mb-1 mb-5 flex flex-col justify-center items-center gap-1" >
            <div className="text-white mb-1">Result</div>
            <div className="max-w-[320px] mb-1" >
                <button onClick={transcode} disabled={disableBtn} className=" flex justify-center w-full text-white bg-black py-2 px-6 
            rounded-md flex gap-2 items-center inline-flex border-2 border-[#130F40]/75 hover:bg-[#130F40]/50 ">Apply Captions</button>
            </div>
            <div className="rounded-xl overflow-hidden max-w-[220px] max-h-[420px]  relative">
                {
                    progress && progress < 1 && (
                        <div className="absolute inset-0 bg-black/80 max-w-[220px] max-h-[420px]  flex items-center">
                            <div className="w-full text-center">
                                <h3 className="text-white text-3xl ">
                                    {parseInt(progress * 100)}%
                                </h3>
                                <div className="bg-[#130F40]/50 mx-8 rounded-lg overflow-hidden">
                                    <div className="bg-[#130F40] h-2 " style={{ width: progress * 100 + '%' }}>
                                    </div>
                                </div>

                            </div>

                        </div>
                    )
                }
                <video
                    data-video={0}
                    ref={videoRef}
                    controls>
                </video>

            </div>
        </div>
    )
}



