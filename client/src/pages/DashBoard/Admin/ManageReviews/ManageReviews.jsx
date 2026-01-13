// src/pages/Dashboard/ManageReviews/ManageReviews.jsx
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageSquare,
  Trash2,
  Star,
  Calendar,
  AlertTriangle,
  Loader2,
  Quote,
  Search,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const ManageReviews = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const deleteModalRef = useRef(null);

  // Fetch Reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/reviews");
      return data;
    },
  });

  // Delete Review Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.delete(`/reviews/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      toast.success("Review deleted successfully");
      deleteModalRef.current?.close();
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Failed to delete review");
    },
  });

  // Format Date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle Delete Click
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    deleteModalRef.current?.showModal();
  };

  // Confirm Delete
  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="text-primary" />
            Manage Reviews
          </h1>
          <p className="text-gray-500 mt-1">{reviews.length} reviews found</p>
        </div>

        {/* Search */}
        <div className="join">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reviews..."
              className="input input-bordered join-item pl-10 focus:outline-none focus:border-primary w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="btn btn-ghost join-item"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <MessageSquare className="size-16 mb-4 opacity-20" />
          <p className="text-lg font-medium">No reviews found</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="btn btn-primary btn-sm mt-4"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="card-body">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="avatar placeholder">
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                        <img
                          src={review?.userImage || "/profile.png"}
                          alt={review?.userName || "User avatar"}
                          onError={(e) => {
                            e.currentTarget.src = "/profile.png";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{review.userName}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="size-3" />
                      {formatDate(
                        review?.updatedAt
                          ? review?.updatedAt
                          : review?.createdAt
                      )}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <div className="badge badge-warning gap-1 badge-sm font-medium">
                      {review.rating} <Star className="size-3 fill-current" />
                    </div>
                  </div>
                </div>

                {/* University Info */}
                <div className="bg-base-200 rounded-lg p-2 mb-3">
                  <p className="text-xs font-semibold text-primary truncate">
                    {review.universityName}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {review.scholarshipName}
                  </p>
                </div>

                {/* Review Content */}
                <div className="relative">
                  <Quote className="size-6 text-base-300 absolute -top-2 -left-2 rotate-180" />
                  <p className="text-sm text-gray-600 italic pl-6 line-clamp-3 min-h-[60px]">
                    "{review.comment}"
                  </p>
                </div>

                {/* Actions */}
                <div className="card-actions justify-end mt-4 pt-4 border-t border-base-200">
                  <button
                    onClick={() => handleDeleteClick(review._id)}
                    className="btn btn-sm btn-error btn-outline gap-2"
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
              className="btn btn-error text-white"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  Delete Review
                </>
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default ManageReviews;
