import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-white">
      <h1 className="text-9xl font-extrabold text-red-500 drop-shadow-lg">
        404
      </h1>
      {/* <p className="mt-4 text-2xl font-semibold text-muted-foreground"> */}
      <p className="mt-4 text-2xl font-semibold text-muted-foreground animate-pulse">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 text-lg font-bold text-gray-900 bg-white rounded-lg shadow-md hover:bg-gray-200 transition-all"
      >
        Go Home
      </Link>
    </div>
  );
}
