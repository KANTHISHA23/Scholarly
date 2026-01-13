import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  FileText,
  Search,
  Eye,
  MessageSquare,
  XCircle,
  CheckCircle,
  Loader2,
  Calendar,
  User,
  University,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Spinner from '../../../../components/Spinner/Spinner';
import { Link } from 'react-router';

const ManageApplications = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const feedbackModalRef = useRef();
  const [selectedApp, setSelectedApp] = useState(null);
  const [feedback, setFeedback] = useState('');

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/applications?email=${user?.email}`
      );
      return data;
    },
  });

  // Mutation for Status Update
  const { mutate: statusMutation } = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await axiosSecure.patch(`/applications/${id}`, {
        applicationStatus: status,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['applications']);
      toast.success('Application status updated!');
    },
  });

  // Mutation for Feedback
  const { mutate: feedbackMutation } = useMutation({
    mutationFn: async ({ id, feedback }) => {
      const { data } = await axiosSecure.patch(`/applications/feedback/${id}`, {
        feedback,
      });
      return data;
    },
    onSuccess: () => {
      feedbackModalRef.current?.close();
      toast.success('Feedback sent successfully!');
      setFeedback('');
    },
  });

  // Format Date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleStatusChange = (id, newStatus) => {
    statusMutation({ id, status: newStatus });
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedback) return toast.error('Please write some feedback');
    feedbackMutation({ id: selectedApp._id, feedback });
  };

  const openFeedbackModal = (app) => {
    setSelectedApp(app);
    feedbackModalRef.current?.showModal();
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
        <div>
          <h1 className='text-2xl font-bold flex items-center gap-2'>
            <FileText className='text-primary' />
            Manage Applications
          </h1>
          <p className='text-gray-500 mt-1'>
            Review and manage student applications ({applications.length})
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body p-0'>
          <div className='overflow-x-auto'>
            <table className='table table-zebra'>
              {/* Table Head */}
              <thead className='bg-base-200'>
                <tr>
                  <th>#</th>
                  <th>Applicant</th>
                  <th>Scholarship Details</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th className='text-center'>Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {applications.map((app, index) => (
                  <tr key={app._id}>
                    <th>{index + 1}</th>

                    {/* Applicant Info */}
                    <td>
                      <div className='flex items-center gap-3'>
                        <div className='avatar'>
                          <div className='w-10 rounded-full'>
                            <img
                              src={app?.userImage || '/profile.png'}
                              alt={app?.userName || 'User avatar'}
                              onError={(e) => {
                                e.currentTarget.src = '/profile.png';
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className='font-bold'>{app.userName}</div>
                          <div className='text-sm opacity-50'>
                            {app.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Scholarship Info */}
                    <td>
                      <div className='flex flex-col gap-1'>
                        <span className='font-semibold flex items-center gap-1'>
                          {app.universityName}
                        </span>
                        <div className='space-x-2'>
                          <span className='text-xs badge badge-info badge-sm text-white'>
                            {app.degree}
                          </span>
                          <span className='text-xs badge badge-secondary badge-sm text-white font-medium'>
                            {app.scholarshipCategory}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td>
                      <div className='flex items-center gap-2 text-sm'>
                        <Calendar className='size-4 text-gray-400' />
                        {formatDate(app.applicationDate)}
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <select
                        disabled={
                          app.applicationStatus === 'rejected' ||
                          app.applicationStatus === 'completed'
                        }
                        className='select select-xs select-bordered w-28
                            data-[status=pending]:select-warning
                            data-[status=completed]:select-success disabled:outline'
                        data-status={app.applicationStatus}
                        value={app.applicationStatus}
                        onChange={(e) =>
                          handleStatusChange(app._id, e.target.value)
                        }
                      >
                        <option value='pending'>Pending</option>
                        <option value='processing'>Processing</option>
                        <option value='completed'>Completed</option>
                        <option value='rejected'>Rejected</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className='flex items-center justify-center gap-2'>
                        {/* View Details */}
                        <Link
                          to={`/scholarship/${app.scholarshipId}`}
                          className='btn btn-square btn-sm btn-ghost text-info'
                          title='View Details'
                        >
                          <Eye className='size-4' />
                        </Link>

                        {/* Feedback */}
                        <button
                          onClick={() => openFeedbackModal(app)}
                          className='btn btn-square btn-sm btn-ghost text-warning'
                          title='Give Feedback'
                        >
                          <MessageSquare className='size-4' />
                        </button>

                        {/* Cancel/Delete */}
                        <button
                          disabled={
                            app.applicationStatus === 'rejected' ||
                            app.applicationStatus === 'completed'
                          }
                          className='btn btn-square btn-sm btn-ghost text-error disabled:text-red-300'
                          title='Cancel Application'
                          onClick={() =>
                            handleStatusChange(app._id, 'rejected')
                          }
                        >
                          <XCircle className='size-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {applications.length === 0 && (
            <div className='flex flex-col items-center justify-center py-16 text-gray-500'>
              <FileText className='size-16 mb-4 opacity-20' />
              <p>No applications found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <dialog
        ref={feedbackModalRef}
        className='modal modal-bottom sm:modal-middle'
      >
        <div className='modal-box'>
          <h3 className='font-bold text-lg flex items-center gap-2'>
            <MessageSquare className='text-warning' />
            Give Feedback
          </h3>
          <p className='py-4 text-sm text-gray-500'>
            Write feedback for <strong>{selectedApp?.userName}</strong>{' '}
            regarding their application to{' '}
            <strong>{selectedApp?.universityName}</strong>.
          </p>

          <form onSubmit={handleFeedbackSubmit}>
            <textarea
              className='textarea textarea-bordered w-full h-32 focus:outline-none focus:border-primary'
              placeholder='Write your feedback here...'
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>

            <div className='modal-action'>
              <button
                type='button'
                className='btn'
                onClick={() => feedbackModalRef.current?.close()}
              >
                Cancel
              </button>
              <button
                type='submit'
                className='btn btn-primary'
                disabled={feedbackMutation.isPending}
              >
                {feedbackMutation.isPending ? 'Sending...' : 'Send Feedback'}
              </button>
            </div>
          </form>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default ManageApplications;
