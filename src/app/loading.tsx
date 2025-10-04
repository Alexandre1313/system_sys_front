import IsLoading from "@/components/ComponentesInterface/IsLoading";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full min-h-[100dvh] bg-slate-800/90 backdrop-blur-sm">
            <div className="bg-slate-700/50 rounded-lg p-6 shadow-xl">
                <IsLoading />
            </div>
        </div>
    );
}
