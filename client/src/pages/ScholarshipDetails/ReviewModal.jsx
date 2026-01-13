// components/ReviewModal/ReviewModal.jsx
import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const ReviewModal = ({
  isOpen,
  onClose,
  scholarshipName,
  universityName,
  scholarshipId,
  onSubmit,
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  // Watch the rating value
  const currentRating = useWatch({ control, name: "rating" });

  // Handle star click
  const handleStarClick = (starValue) => {
    setValue("rating", starValue, { shouldValidate: true });
  };

  // Handle form submission
  const handleFormSubmit = (data) => {
    const reviewData = {
      ...data,
      scholarshipId,
      scholarshipName,
      universityName,
      name: user?.displayName,
      email: user?.email,
      avater: user?.photoURL,
    };
    onSubmit(reviewData);
    reset();
    onClose();
  };

  // Handle modal close
  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        {/* Close Button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={handleClose}
        >
          ✕
        </button>

        {/* Modal Title */}
        <h3 className="font-bold text-lg mb-4">Write a Review</h3>

        {/* Scholarship & University Info */}
        <div className="bg-base-200 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-500">Scholarship</p>
          <p className="font-semibold">{scholarshipName}</p>
          <p className="text-sm text-gray-500 mt-2">University</p>
          <p className="font-semibold">{universityName}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Rating Section */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-medium">Your Rating</span>
            </label>

            {/* Hidden input for rating */}
            <input
              type="hidden"
              {...register("rating", {
                required: "Please select a rating",
                min: { value: 1, message: "Please select a rating" },
              })}
            />

            {/* Star Rating UI */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="text-3xl cursor-pointer transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleStarClick(star)}
                >
                  <FaStar
                    className={`${
                      star <= (hoveredRating || currentRating)
                        ? "text-warning"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 self-center text-sm text-gray-500">
                {currentRating > 0 && `${currentRating} out of 5`}
              </span>
            </div>

            {/* Rating Error */}
            {errors.rating && (
              <span className="text-error text-sm mt-1">
                {errors.rating.message}
              </span>
            )}
          </div>

          {/* Review Comment Section */}
          <div className="form-control flex flex-col gap-1 mb-6">
            <label className="label">
              <span className="label-text font-medium">Your Review</span>
            </label>
            <textarea
              className={`textarea textarea-bordered h-32 w-full focus:outline-none focus:border-primary ${
                errors.comment ? "textarea-error" : ""
              }`}
              placeholder="Share your experience with this scholarship..."
              {...register("comment", {
                required: "Review comment is required",
                minLength: {
                  value: 10,
                  message: "Review must be at least 10 characters",
                },
              })}
            />
            {errors.comment && (
              <span className="text-error text-sm mt-1">
                {errors.comment.message}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="modal-action">
            <button type="button" className="btn" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit Review
            </button>
          </div>
        </form>
      </div>

      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
};

export default ReviewModal;
