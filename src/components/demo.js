export default function DemoVideo() {
    return (
        <div className="mt-4  flex justify-center items-center gap-6">
            <div className="bg-gray-800/50 max-w-[220px] max-h-[420px] rounded-md md:block hidden overflow-hidden">
            <video src="https://udai-captions.s3.amazonaws.com/jl8lolkbn8q.mp4" preload muted autoPlay loop></video>
            </div>
            <div className="md:block hidden"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-8 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
            </div>
            <div className="bg-gray-800/50 max-w-[220px] max-h-[420px] rounded-md overflow-hidden">
            <video src="https://udai-captions.s3.amazonaws.com/jl8lolkhdw1.mp4" preload muted autoPlay loop></video>
            </div>
        </div>
    )
}