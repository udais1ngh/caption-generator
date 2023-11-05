"use client"

import TranscriptionItems from "@/components/TranscriptionItem";
import ResultVideo from "@/components/resultvideo";
import axios from "axios"
import { useEffect, useState } from "react"

export default function FilePage({ params }) {
    const fileName = params.filename

    const [isTranscribingStatus, setTranscribingStatus] = useState(false);

    const [isFetchingInfo, setIsFetchingInfo] = useState(false);

    const [transcribedItems, setTranscribedItems] = useState([]);

    




    async function getTranscription() {
        setIsFetchingInfo(true);
        await axios.get('/api/transcribe?filename=' + fileName).then(response => {
            setIsFetchingInfo(false);
            const status = response.data?.status;
            const transcription = response.data?.transcription;

            if (status == 'IN_PROGRESS') {
                setTranscribingStatus(true)
                setTimeout(getTranscription, 3000);
            } else {
                setTranscribingStatus(false);

                transcription.results.items.forEach((item, key) => {
                    if (!item.start_time) {
                        transcription.results.items[key - 1].alternatives[0].content += item.alternatives[0].content;
                        delete transcription.results.items[key];
                    }
                });

                if (transcription?.results?.items) {

                    setTranscribedItems(transcription.results.items.map(item => {
                        const { start_time, end_time } = item;
                        const content = item.alternatives[0].content;
                        return { start_time, end_time, content }
                    }))
                }

            }
        })
    }

    useEffect(() => {

        getTranscription();


    }, [fileName])


    if (isTranscribingStatus) {
        return (
            <div className="text-white">
                Transcription in progress....
            </div>
        )
    }

    if (isFetchingInfo) {
        return (
            <div className="text-white">
                Fetching Information...
            </div>
        )
    }

    return (

        <div className="grid md:grid-cols-2 grid-cols-1 md:mx-40 mx-3 gap-5">
            <div className="flex flex-col justify-center items-center gap-2">
                <div className="text-white">Transription</div>

                <div className="ml-3 flex  gap-1">
                    <div className="w-24 text-white/60">From</div>
                    <div className="w-24 text-white/60">End</div>
                    <div className="w-24 text-white/60">Content</div>
                </div>
                <div className="sc text-white h-[500px] w-[320px]  overflow-scroll scrollbar-color: transparent  border-2 border-[#130F40]/75 p-auto grid place-items-center">
                    {
                        transcribedItems.length > 0 && transcribedItems.map((item, key) => (
                            <div key={key}>

                                <TranscriptionItems

                                    handleStartTimeChange={(ev) => {
                                        const newAwsItemss = [...transcribedItems];
                                        newAwsItemss[key].start_time = ev.target.value;
                                        setTranscribedItems(newAwsItemss);
                                    }}

                                    handleEndTimeChange={(ev) => {
                                        const newAwsItemss = [...transcribedItems];
                                        newAwsItemss[key].end_time = ev.target.value;
                                        setTranscribedItems(newAwsItemss);
                                    }}

                                    handleContentChange={(ev) => {
                                        const newAwsItemss = [...transcribedItems];
                                        newAwsItemss[key].content = ev.target.value;
                                        setTranscribedItems(newAwsItemss);
                                    }}


                                    item={item} />
                            </div>

                        ))
                    }
                </div>

            </div>

            <ResultVideo fileName={fileName}
            transcribedItems={transcribedItems} />
        </div>
    )
}
