import { useState } from "react";
import { useForm } from "react-hook-form";
import Container from "../../../components/Container/Container";
import { Link } from "react-router";
import Lottie from "lottie-react";
import forgotPasswordAnimation from "../../../assets/animations/forgot-password-animation.json";
import { FaArrowLeft, FaCheckCircle, FaEnvelope } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

//Firebase handles the "Reset Password" logic entirely on their servers
const ForgotPassword = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");

  const { setAuthLoading, authLoading, resetPassEmailFunc } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setAuthLoading(true);
    setError("");

    try {
      await resetPassEmailFunc(data.email);
      setIsEmailSent(true);
    } catch (err) {
      console.error("Failed to send reset email:", err);

      // Handle different Firebase error codes
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email address.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address format.");
          break;
        case "auth/too-many-requests":
          setError("Too many requests. Please try again later.");
          break;
        default:
          setError(
            err.message || "Failed to send reset email. Please try again."
          );
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleTryAgain = () => {
    setIsEmailSent(false);
    setError("");
    reset();
  };

  return (
    <Container
      className={
        "min-h-[calc(100vh-72px)] flex items-center justify-center py-8"
      }
    >
      <div className="card bg-base-100 w-full max-w-md shrink-0 shadow-2xl">
        <div className="card-body">
          {/* Back Button */}
          <Link
            to="/signIn"
            className="flex items-center gap-2 text-gray-600 hover:text-primary mb-4 w-fit"
          >
            <FaArrowLeft size={14} />
            Back to Sign In
          </Link>

          {/* Lottie Animation */}
          <div className="flex justify-center mb-4">
            <Lottie
              animationData={forgotPasswordAnimation}
              loop={true}
              autoplay={true}
              style={{ width: "200px", height: "200px" }}
            />
          </div>

          {!isEmailSent ? (
            <>
              <h3 className="text-center text-2xl font-semibold mb-2">
                Forgot Password?
              </h3>
              <p className="text-center text-gray-500 mb-6">
                No worries! Enter your email and we'll send you a reset link.
              </p>

              {/* Error Alert */}
              {error && (
                <div className="alert alert-error mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="fieldset space-y-4">
                  {/* Email Field */}
                  <div>
                    <label className="custom-label">
                      Email <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        className={`input focus:border-primary focus:outline-none w-full ${
                          errors.email ? "input-error" : ""
                        }`}
                        placeholder="Enter your email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Please enter a valid email address",
                          },
                        })}
                      />
                    </div>
                    {errors.email && (
                      <span className="text-error text-sm mt-1 block">
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit" // type submit btn is not required the handle submit
                    // func it's automatically detected
                    className="btn btn-primary w-full"
                    disabled={authLoading}
                  >
                    {authLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Sending Reset Link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </fieldset>
              </form>
            </>
          ) : (
            /* Success Message */
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-success text-4xl" />
                </div>
              </div>

              <h3 className="text-2xl font-semibold mb-2">Check Your Email!</h3>

              <p className="text-gray-500 mb-2">
                We've sent a password reset link to:
              </p>

              <p className="font-medium text-primary mb-4 break-all">
                {getValues("email")}
              </p>

              <div className="bg-base-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Next steps:</strong>
                </p>
                <ol className="text-sm text-gray-500 list-decimal list-inside space-y-1">
                  <li>Check your email inbox</li>
                  <li>Click the reset link in the email</li>
                  <li>Create a new password</li>
                </ol>
              </div>

              <p className="text-sm text-gray-400 mb-4">
                Didn't receive the email? Check your spam folder or
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsEmailSent(false);
                    // Resend to same email
                    handleSubmit(onSubmit)();
                  }}
                  className="btn btn-primary btn-outline"
                  disabled={authLoading}
                >
                  {authLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Resending...
                    </>
                  ) : (
                    "Resend Email"
                  )}
                </button>

                <button onClick={handleTryAgain} className="btn btn-ghost">
                  Try Different Email
                </button>
              </div>
            </div>
          )}

          {/* Additional Help */}
          {!isEmailSent && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Remember your password?{" "}
                <Link
                  to="/signIn"
                  className="text-primary font-medium hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default ForgotPassword;
