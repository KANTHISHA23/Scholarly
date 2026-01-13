import { Home, Search } from "lucide-react";
import { Link, useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          {/* Visual Element: You can replace this text with a Lottie Animation or Image */}
          <h1 className="text-9xl font-black text-primary opacity-50">404</h1>

          <h2 className="text-4xl font-bold mt-4">Page Not Found</h2>

          <p className="py-6 text-gray-500">
            Oops! The scholarship opportunity you are looking for might have
            expired, been removed, or the link is broken. Don't worry, there are
            plenty more opportunities waiting!
          </p>

          {/* Optional: Show technical error if it exists */}
          {error && (
            <p className="text-sm text-red-400 mb-6">
              <i>{error.statusText || error.message}</i>
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn btn-primary px-8">
              <Home className="mr-2" />
              Back to Home
            </Link>

            <Link
              to="/scholarships"
              className="btn btn-outline btn-secondary px-8"
            >
              <Search className="mr-2" />
              Find Scholarships
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
