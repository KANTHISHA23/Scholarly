import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import {
  MessageSquare,
  Edit,
  Trash2,
  Star,
  Calendar,
  University,
  AlertTriangle,
  Loader2,
  Quote,
} from "lucide-react";
import toast from "react-hot-toast";
import ReviewModal from "../../../ScholarshipDetails/ReviewModal";
import Spinner from "../../../../components/Spinner/Spinner";

const MyReviews = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [deleteId, setDeleteId] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const deleteModalRef = useRef(null);

  // Fetch Reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["my-reviews", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/reviews/user/${user?.email}`);
      return data;
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.delete(`/reviews/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-reviews"]);
      toast.success("Review deleted successfully");
      deleteModalRef.current?.close();
    },
    onError: () => {
      toast.error("Failed to delete review");
    },
  });

  // Update Mutation (Handled via Modal)
  const handleEditSubmit = async (reviewData) => {
    try {
      // Assuming your update API is PATCH /reviews/:id
      const { data } = await axiosSecure.patch(
        `/reviews/${selectedReview._id}`,
        reviewData
      );
      if (data.modifiedCount > 0) {
        toast.success("Review updated successfully");
        queryClient.invalidateQueries(["my-reviews"]);
        setIsReviewModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to update review");
    }
  };

  const handleEditClick = (review) => {
    setSelectedReview(review);
    setIsReviewModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    deleteModalRef.current?.showModal();
  };

  const confirmDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId);
  };

  // Format Date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="text-primary" />
          My Reviews
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your feedback and ratings ({reviews.length})
        </p>
      </div>

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 card bg-base-100 border border-base-200">
          <MessageSquare className="size-16 mb-4 opacity-20" />
          <p className="text-lg font-medium">No reviews yet</p>
          <p className="text-sm">Reviews you submit will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="card bg-base-100 shadow hover:shadow-lg transition-shadow border border-base-200"
            >
              <div className="card-body">
                {/* University Info */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-lg text-primary">
                    <University className="size-5" />
                    <span className="line-clamp-1">
                      {review.universityName}
                    </span>
                  </div>
                  <div className="badge badge-warning gap-1 font-medium">
                    {review.rating} <Star className="size-3 fill-current" />
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-4 line-clamp-1">
                  {review.scholarshipName}
                </p>

                {/* Comment */}
                <div className="relative bg-base-200/50 p-3 rounded-lg mb-4 grow">
                  <Quote className="size-4 text-base-300 absolute -top-2 -left-1 rotate-180 fill-current" />
                  <p className="text-sm text-gray-600 italic line-clamp-4">
                    "{review.comment}"
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-base-200">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="size-3" />
                    {formatDate(
                      review?.updatedAt ? review?.updatedAt : review?.createdAt
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(review)}
                      className="btn btn-square btn-sm btn-ghost text-warning hover:bg-warning/10"
                      title="Edit Review"
                    >
                      <Edit className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(review._id)}
                      className="btn btn-square btn-sm btn-ghost text-error hover:bg-error/10"
                      title="Delete Review"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Review Modal */}
      {isReviewModalOpen && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedReview(null);
          }}
          scholarshipName={selectedReview?.scholarshipName}
          universityName={selectedReview?.universityName}
          scholarshipId={selectedReview?.scholarshipId}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* Delete Confirmation Modal */}
      <dialog
        ref={deleteModalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4">
              <AlertTriangle className="size-8 text-error" />
            </div>
            <h3 className="font-bold text-lg">Delete Review?</h3>
            <p className="py-4 text-gray-500 text-sm">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
          </div>

          <div className="modal-action justify-center gap-3">
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
            <button
              onClick={confirmDelete}
              className="btn btn-error text-white gap-2"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Delete
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="btn">close</button>
        </form>
      </dialog>
    </div>
  );
};

export default MyReviews;
