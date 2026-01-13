import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import Container from '../../components/Container/Container';
import {
  FaUniversity,
  FaMapMarkerAlt,
  FaStar,
  FaClock,
  FaBookmark,
  FaArrowLeft,
  FaTrophy,
  FaInfoCircle,
  FaAward,
  FaCalendarCheck,
} from 'react-icons/fa';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { MdFeedback } from 'react-icons/md';
import useAuth from '../../hooks/useAuth';
import ReviewModal from './ReviewModal';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner/Spinner';

const ScholarshipDetails = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- Queries ---
  const {
    data: scholarship,
    isLoading: scholarshipLoading,
    refetch: scholarshipRefetch,
  } = useQuery({
    queryKey: ['scholarship', id],
    queryFn: async () => {
      const { data } = await axiosSecure(`/scholarships/${id}`);
      return data;
    },
    enabled: !!id,
  });

  const {
    _id,
    scholarshipName,
    universityName,
    universityImage,
    state,
    scholarshipCategory,
    subjectCategory,
    degree,
    scholarshipAmount,
    applicationDeadline,
    description,
    ratings,
    scholarshipLink,
  } = scholarship || {};

  const {
    data: reviewsData = [],
    isLoading: reviewLoading,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/reviews/${id}`);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!id,
  });

  const reviews = Array.isArray(reviewsData) ? reviewsData : [];

  const {
    data: wishlistStatus = { isSaved: false, id: null },
    refetch: refetchWishlist,
  } = useQuery({
    queryKey: ['wishlist-status', id, user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/wishlists/check/${id}?email=${user?.email}`
      );
      return data;
    },
    enabled: !!user?.email && !!id,
  });

  const [isBookmarked, setIsBookmarked] = useState(false);
  useEffect(() => {
    setIsBookmarked(wishlistStatus.isSaved);
  }, [wishlistStatus]);

  // --- Mutations & Handlers ---
  const { mutate: deleteMutation } = useMutation({
    mutationFn: async (wishlistId) => {
      const { data } = await axiosSecure.delete(`/wishlists/${wishlistId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wishlists']);
      refetchWishlist();
      setIsBookmarked(false);
      toast.success('Removed from wishlist');
    },
  });

  const handleSaveScholaship = async () => {
    if (!user) return toast.error('Please login first');
    setSaveLoading(true);
    try {
      if (isBookmarked) {
        if (wishlistStatus?.id) deleteMutation(wishlistStatus.id);
      } else {
        const wishlistData = { scholarshipId: _id, userEmail: user?.email };
        const { data } = await axiosSecure.post('/wishlists', wishlistData);
        if (data?.insertedId) {
          refetchWishlist();
          setIsBookmarked(true);
          toast.success('Added to wishlist');
        }
      }
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setSaveLoading(false);
    }
  };

  // FIXED: Added handleReviewSubmit back into the component scope
  const handleReviewSubmit = async (reviewData) => {
    try {
      const { data } = await axiosSecure.post('/reviews', reviewData);
      if (data?.insertedId || data?.modifiedCount) {
        toast.success('Review submitted successfully!');
        refetchReviews();
        scholarshipRefetch();
        setIsReviewModalOpen(false);
      }
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

 const handleApply = () => {
   if (scholarshipLink) {
     window.open(scholarshipLink, '_blank', 'noopener,noreferrer');
   } else {
     toast.error('Official link not available for this scholarship.');
   }
 };

  if (scholarshipLoading || reviewLoading) return <Spinner />;

  const getDaysRemaining = (deadline) => {
    if (!deadline) return 0;
    const diff = new Date(deadline) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  const daysRemaining = getDaysRemaining(applicationDeadline);


// Helper function to handle the formatted string (with commas)
const formatAmount = (amt) => {
  if (!amt) return 0;
  // Remove commas so Number() can read it properly
  const cleanNumber = Number(amt.toString().replace(/,/g, ''));
  return isNaN(cleanNumber) ? 0 : cleanNumber;
};
  console.log('Full Scholarship Object:', scholarship);

  return (
    <div className='bg-base-200 min-h-screen pb-16'>
      {/* Hero Section */}
      <div className='relative h-[350px] md:h-[450px] overflow-hidden'>
        <img
          src={universityImage}
          className='w-full h-full object-cover'
          alt={universityName}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent'></div>
        <div className='absolute bottom-0 left-0 w-full p-6 md:p-12'>
          <Container>
            <div className='flex gap-2 mb-4'>
              <span className='badge badge-primary font-bold uppercase'>
                {scholarshipCategory}
              </span>
              <span className='badge badge-secondary font-bold uppercase'>
                {degree}
              </span>
            </div>
            <h1 className='text-4xl md:text-6xl font-black text-white mb-4 leading-tight'>
              {scholarshipName}
            </h1>
            <div className='flex flex-wrap items-center gap-4 text-white/90 text-lg font-medium'>
              <span className='flex items-center gap-2'>
                <FaUniversity className='text-primary' /> {universityName}
              </span>
              <span className='hidden md:block opacity-40'>|</span>
              <span className='flex items-center gap-2'>
                <FaMapMarkerAlt className='text-secondary' /> {state}, India
              </span>
            </div>
          </Container>
        </div>
      </div>

      <Container>
        <div className='mt-8'>
          <Link
            to='/scholarships'
            className='btn btn-ghost hover:bg-base-300 gap-2 font-bold'
          >
            <FaArrowLeft /> Back to List
          </Link>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='relative overflow-hidden bg-white border border-base-200 p-6 rounded-3xl shadow-sm group '>
                <p className='text-xs font-black uppercase text-base-content/50'>
                  Application Status
                </p>

                <div className='flex items-center gap-3 p-3'>
                  {daysRemaining > 0 ? (
                    <>
                      {/* The Live Indicator */}
                      <div className='relative flex h-4 w-4'>
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            daysRemaining <= 7 ? 'bg-error' : 'bg-success'
                          }`}
                        ></span>
                        <span
                          className={`relative inline-flex rounded-full h-4 w-4 ${
                            daysRemaining <= 7 ? 'bg-error' : 'bg-success'
                          }`}
                        ></span>
                      </div>

                      {/* Simple Status Text */}
                      <h3
                        className={`text-2xl font-black leading-none ${
                          daysRemaining <= 7 ? 'text-error' : 'text-success'
                        }`}
                      >
                        {daysRemaining <= 7 ? 'Closing Soon' : 'Active'}
                      </h3>
                    </>
                  ) : (
                    <h3 className='text-2xl font-black text-base-content/30 italic'>
                      Expired
                    </h3>
                  )}
                </div>

                {/* Aesthetic Background Glow */}
                <div
                  className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-10 ${
                    daysRemaining <= 7 ? 'bg-error' : 'bg-success'
                  }`}
                ></div>
              </div>

              <div className='bg-base-100 border border-base-300 p-6 rounded-3xl'>
                <p className='text-xs font-black uppercase text-base-content/50'>
                  Specialization
                </p>
                <h3 className='text-lg font-black flex items-center gap-2 p-3'>
                  <FaTrophy className='text-warning' />
                  {subjectCategory || 'General'}
                </h3>
              </div>
              <div className='bg-base-100 border border-base-300 p-6 rounded-3xl'>
                <p className='text-xs font-black uppercase text-base-content/50'>
                  User Rating
                </p>
                <h3 className='text-3xl font-black flex items-center gap-2 p-3'>
                  <FaStar className='text-orange-400' /> {ratings || 0}
                </h3>
              </div>
            </div>

            <div className='card bg-base-100 shadow-xl border border-base-300 rounded-3xl overflow-hidden'>
              <div className='card-body p-8'>
                <h2 className='text-2xl font-black mb-4 flex items-center gap-3'>
                  <FaInfoCircle className='text-primary' /> Overview
                </h2>
                <p className='text-lg leading-relaxed text-base-content/80'>
                  {description}
                </p>

                <div className='divider my-6'></div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex items-center gap-4 bg-base-200 p-4 rounded-2xl'>
                    <div className='p-3 bg-white rounded-xl shadow-sm text-primary'>
                      <FaAward size={20} />
                    </div>
                    <div>
                      <p className='text-xs font-bold uppercase opacity-50'>
                        Degree Type
                      </p>
                      <p className='font-black text-lg'>{degree}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-4 bg-base-200 p-4 rounded-2xl'>
                    <div className='p-3 bg-white rounded-xl shadow-sm text-secondary'>
                      <FaCalendarCheck size={20} />
                    </div>
                    <div>
                      <p className='text-xs font-bold uppercase opacity-50'>
                        Final Deadline
                      </p>
                      <p className='font-black text-lg'>
                        {applicationDeadline}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            <div className='card bg-base-100 shadow-2xl sticky top-24 border border-primary/20 rounded-3xl overflow-hidden'>
              <div className='bg-primary/5 p-8'>
                <div
                  className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-black mb-6 ${
                    daysRemaining <= 7
                      ? 'bg-error/10 text-error'
                      : 'bg-success/10 text-success'
                  }`}
                >
                  <FaClock />{' '}
                  {daysRemaining > 0
                    ? `${daysRemaining} Days Remaining`
                    : 'Closed'}
                </div>
                <div className='text-center mb-8'>
                  <p className='text-xs font-black text-base-content/40 uppercase tracking-widest'>
                    Financial Support
                  </p>
                  <h3 className='text-5xl font-black text-primary flex items-center justify-center'>
                    <FaIndianRupeeSign size={30} />
                    {formatAmount(scholarshipAmount).toLocaleString('en-IN')}
                  </h3>
                </div>
                <button
                  onClick={handleApply}
                  disabled={daysRemaining <= 0}
                  className='btn btn-primary btn-block btn-lg rounded-2xl text-white font-black shadow-xl shadow-primary/20'
                >
                  Apply for Free
                </button>
                <div className='grid grid-cols-2 gap-3 mt-4'>
                  <button
                    onClick={handleSaveScholaship}
                    className={`btn btn-outline border-2 rounded-xl font-bold ${
                      isBookmarked ? 'btn-secondary' : ''
                    }`}
                  >
                    <FaBookmark /> {isBookmarked ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className='btn btn-outline border-2 rounded-xl font-bold'
                  >
                    <MdFeedback /> Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className='mt-16'>
          <h2 className='text-3xl font-black mb-8 flex items-center gap-3'>
            <MdFeedback className='text-primary' /> Student Experiences
          </h2>
          {reviews.length === 0 ? (
            <div className='p-16 bg-base-100 rounded-3xl text-center border-4 border-dashed border-base-300'>
              <p className='text-xl font-bold opacity-30'>
                No one has reviewed this scholarship yet.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className='card bg-base-100 border border-base-300 rounded-3xl p-6'
                >
                  <div className='flex items-center gap-4 mb-4'>
                    <div className='avatar placeholder'>
                      <div className='bg-primary text-primary-content rounded-xl w-12 font-black shadow-md'>
                        <span>{review?.userName?.charAt(0)}</span>
                      </div>
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-black text-lg'>{review?.userName}</h4>
                      <div className='rating rating-xs'>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <input
                            key={s}
                            type='radio'
                            className='mask mask-star-2 bg-orange-400'
                            checked={s === review.rating}
                            readOnly
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className='text-base-content/70 italic'>
                    "{review?.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        scholarshipName={scholarshipName}
        universityName={universityName}
        scholarshipId={_id}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
};

export default ScholarshipDetails;
