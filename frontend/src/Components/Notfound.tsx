import { Link } from "react-router";

export default function NotFound({ msg }: { msg?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <div className="text-5xl font-bold text-blue-600 mb-8">🚗</div>
        <p className="text-2xl font-semibold text-gray-700 mb-4">
          {msg ? msg : "Oops! Page not found "}
        </p>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't seem to exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
