import { useNavigate } from "react-router";
import Lottie from "lottie-react";
import forbiddenAnimation from "../../assets/animations/forbidden.json";
import { Home, ShieldAlert, ArrowLeft } from "lucide-react";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-130px)] bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl max-w-lg w-full text-center">
        <div className="card-body items-center">
          {/* Lottie Animation */}
          <div className="w-64 h-64">
            <Lottie
              animationData={forbiddenAnimation}
              loop={true}
              autoplay={true}
            />
          </div>

          {/* Text Content */}
          <div className="space-y-2 mb-6">
            <h1 className="text-4xl font-bold text-error flex items-center justify-center gap-2">
              <ShieldAlert className="size-10" />
              403
            </h1>
            <h2 className="text-2xl font-bold">Access Forbidden</h2>
            <p className="text-gray-500">
              Sorry, you don't have permission to access this page. Please
              contact your administrator if you think this is a mistake.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={() => navigate(-1)}
              className="btn gap-2"
            >
              <ArrowLeft className="size-4" />
              Go Back
            </button>

            <button
              onClick={() => navigate("/")}
              className="btn btn-primary gap-2"
            >
              <Home className="size-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
