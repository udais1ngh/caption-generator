"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react"

export default function Main() {

    const [uploading, setUploading] = useState(false);

    const fileRef = useRef();

    const router = useRouter();

    function onUploadClick() {

        fileRef.current.click()

    }

    async function upload(ev) {

        ev.preventDefault();
        const files = ev.target.files
        if (files.length > 0) {
            const file = files[0];
            setUploading(true);
            const res = await axios.postForm('/api/upload', {
                file,
            });
            setUploading(false);
            const newName = res.data.nweName;
             router.push('/'+newName);
            console.log(res.data);
        }

    }

    return (
        <div className="text-white mt-20">
            <div className="flex justify-center flex-col items-center">
                <h1 className="md:text-4xl text-2xl text-center">Add accurate captions to your videos</h1>
                <h2 className="text-white/75 md:text-xl text-sm">Just upload your video and leave rest to us.</h2>
            </div>
            {
                uploading && (
                    <div className="text-center mt-3">
                        <input onChange={upload} ref={fileRef} className="hidden" type="file" />
                        <button onClick={onUploadClick} disabled={uploading} className=" bg-slate-900 py-2 px-6 rounded-md flex gap-2 items-center inline-flex border-2 border-[#130F40]/75"><span>Uploading....</span>
                        </button>

                    </div>
                )
            }
            {
                !uploading && (
                    <div className="text-center mt-3">
                        <input onChange={upload} ref={fileRef} className="hidden" type="file" />
                        <button onClick={onUploadClick} className="bg-black py-2 px-6 rounded-md flex gap-2 items-center inline-flex border-2 border-[#130F40]/75"><span>Upload</span><span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        </span>
                        </button>

                    </div>
                )
            }


        </div>
    )
}