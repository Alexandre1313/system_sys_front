export default function Skeleton() {
    return (
        <div className="flexColCS border border-gray-800 animate-pulse">
            <div className="h-48 bg-gray-300 rounded-md w-full"></div>
            <div className="h-6 bg-gray-300 rounded-md mt-2 w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded-md mt-1 w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded-md mt-1 w-2/3"></div>
        </div>
    );
}
