// src/pages/Dashboard/MyApplications/MyApplications.jsx
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  FileText,
  University,
  MapPin,
  MessageSquare,
  IndianRupee,
  Info,
  Edit,
  Trash2,
  Star,
  CreditCard,
  Eye,
  Loader2,
  X,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import Spinner from "../../../../components/Spinner/Spinner";
import ReviewModal from "../../../ScholarshipDetails/ReviewModal";
import Swal from "sweetalert2";

const MyApplications = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // State
  const [deleteId, setDeleteId] = useState(null);
  const [reviewApp, setReviewApp] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  // Modals Refs
  const deleteModalRef = useRef(null);

  // Fetch Applications
  const {
    data: applications = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-applications", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/applications/${user?.email}/byUser`
      );
      return data;
    },
  });

  // Delete Mutation
  const { mutate: deleteMutation } = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.delete(`/applications/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-applications"]);
      toast.success("Application deleted successfully");
      deleteModalRef.current?.close();
    },
    onError: () => {
      toast.error("Failed to delete application");
    },
  });

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    deleteModalRef.current?.showModal();
  };

  const confirmDelete = () => {
    if (deleteId) deleteMutation(deleteId);
  };

  const handleReview = (app) => {
    setIsReviewModalOpen(true);
    setReviewApp(app);
  };

  // handle review submit
  const handleReviewSubmit = async (reviewData) => {
    try {
      const { data } = await axiosSecure.post("/reviews", reviewData);
      if (data?.upsertedCount) {
        toast.success("Review added");
      }
      if (data?.modifiedCount) {
        toast.success("Review updated");
      }
      refetch();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to submit review. Please try again.",
      });
    }
  };

  

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="badge badge-warning">Pending</span>;
      case "processing":
        return <span className="badge badge-info">Processing</span>;
      case "completed":
        return (
          <span className="badge badge-success text-white">Completed</span>
        );
      case "rejected":
        return <span className="badge badge-error text-white">Rejected</span>;
      default:
        return <span className="badge badge-ghost">{status}</span>;
    }
  };

  // Loading State
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-2xl font-bold flex items-center gap-2'>
          <FileText className='text-primary' />
          My Applications
        </h1>
        <p className='text-gray-500 mt-1'>
          Track and manage your scholarship applications ({applications.length})
        </p>
      </div>

      {/* Applications Table */}
      <div className='card bg-base-100 border border-gray-200 overflow-hidden'>
        {applications.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 text-gray-500'>
            <FileText className='size-16 mb-4 opacity-20' />
            <p className='text-lg font-medium'>No applications found</p>
            <Link
              to='/all-scholarships'
              className='btn btn-primary btn-sm mt-4'
            >
              Browse Scholarships
            </Link>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='table'>
              {/* Head */}
              <thead className='bg-base-200'>
                <tr>
                  <th>University</th>
                  <th>Category</th>
                  <th>Family Annual Income</th>
                  <th>Status</th>
                  <th>Feedback</th>
                  <th className='text-center'>Actions</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className='hover'>
                    {/* University Info */}
                    <td>
                      <div>
                        <div className='font-bold flex items-center gap-2'>
                          <University className='size-4 text-primary' />
                          {app.universityName}
                        </div>
                        <div className='text-xs text-gray-500 flex items-center gap-1 mt-1'>
                          <MapPin className='size-3' />
                          {app.universityCity}, {app.universityCountry}
                        </div>
                      </div>
                    </td>

                    {/* Subject Category */}
                    <td>
                      <div className='flex flex-col gap-1.5'>
                        <div className='badge badge-ghost text-xs'>
                          {app.subjectCategory}
                        </div>
                        <div className='text-xs badge badge-soft'>
                          {app.degree}
                        </div>
                      </div>
                    </td>

                    {/*Family Annual Income*/}
                    <td>
                      <div className='flex items-center gap-1 font-medium'>
                        <IndianRupee className='size-3' />
                        {app.familyAnnualIncome}
                      </div>
                    </td>

                    {/* Status */}
                    <td>{getStatusBadge(app.applicationStatus)}</td>

                    {/* Feedback (if any) */}
                    <td>
                      {app.feedback ? (
                        <div
                          className='tooltip tooltip-left'
                          data-tip={app.feedback}
                        >
                          <button className='btn btn-ghost btn-xs text-info'>
                            <MessageSquare className='size-4' />
                          </button>
                        </div>
                      ) : (
                        <span className='text-xs text-gray-400'>
                          No feedback
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className='flex items-center justify-center gap-2'>
                        {/* Details Button */}
                        <Link
                          to={`/scholarship/${app.scholarshipId}`}
                          className='btn btn-square btn-sm btn-ghost text-info'
                          title='View Details'
                        >
                          <Eye className='size-4' />
                        </Link>

                        {/* Edit Button (Only if pending) */}
                        {app.applicationStatus === 'pending' && (
                          <Link
                            to={`/dashboard/edit-application/${app._id}`}
                            className='btn btn-square btn-sm btn-ghost text-warning'
                            title='Edit Application'
                          >
                            <Edit className='size-4' />
                          </Link>
                        )}

                        {/* Delete Button (Only if pending) */}
                        {app.applicationStatus === 'pending' && (
                          <button
                            onClick={() => handleDeleteClick(app._id)}
                            className='btn btn-square btn-sm btn-ghost text-error'
                            title='Cancel Application'
                          >
                            <Trash2 className='size-4' />
                          </button>
                        )}

                        {/* Add Review Button (Only if completed) */}
                        {
                          <button
                            onClick={() => handleReview(app)}
                            className='btn btn-square btn-sm btn-ghost text-warning'
                            title='Add Review'
                          >
                            <Star className='size-4' />
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        scholarshipName={reviewApp?.scholarshipName}
        universityName={reviewApp?.universityName}
        scholarshipId={reviewApp?.scholarshipId}
        onSubmit={handleReviewSubmit}
      />

      {/*  Delete Confirmation Modal */}
      <dialog
        ref={deleteModalRef}
        className='modal modal-bottom sm:modal-middle'
      >
        <div className='modal-box'>
          <div className='flex flex-col items-center text-center'>
            <div className='w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4'>
              <AlertTriangle className='size-8 text-error' />
            </div>
            <h3 className='font-bold text-lg'>Cancel Application?</h3>
            <p className='py-4 text-gray-500 text-sm'>
              Are you sure you want to cancel this application? This action
              cannot be undone.
            </p>
          </div>

          <div className='modal-action justify-center gap-3'>
            <form method='dialog'>
              <button className='btn'>No, Keep it</button>
            </form>
            <button
              onClick={confirmDelete}
              className='btn btn-error text-white gap-2'
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className='animate-spin size-4' />
              ) : (
                <Trash2 className='size-4' />
              )}
              Yes, Delete it
            </button>
          </div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default MyApplications;
