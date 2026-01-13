import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import {
  Trash2,
  MapPin,
  GraduationCap,
  Loader2,
  HeartOff,
  DollarSign,
  University,
  Coins,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import Container from '../../components/Container/Container';

const WishList = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Wishlist Data
  // WishList.jsx queryFn
  const { data: wishlistsData, isLoading } = useQuery({
    queryKey: ['wishlists', user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/wishlists?email=${user?.email}`);
      // Ensure you are returning the array.
      // If backend sends result directly, 'data' is the array.
      return data;
    },
    enabled: !!user?.email,
  });

  // Force 'wishlists' to be an array so .length and .map don't crash
  const wishlists = Array.isArray(wishlistsData) ? wishlistsData : [];

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.delete(`/wishlists/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wishlists']);
      toast.success('Removed from wishlist');
    },
    onError: () => {
      toast.error('Failed to remove scholarship');
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Remove from Wishlist?',
      text: 'You can add it back later if you change your mind.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#3B82F6',
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='size-10 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <Container className={'py-10 md:py-20'}>
      {/* Header */}
      <div className='text-center mb-12'>
        <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4'>
          <span className='text-lg'>💖</span> Saved Opportunities
        </div>

        <h1 className='text-3xl md:text-5xl font-extrabold mb-4 text-base-content'>
          My <span className='text-primary'>Wishlist</span>
        </h1>

        <p className='text-base md:text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed'>
          Keep track of your favorite scholarships. Review, compare, and apply
          when you're ready to take the next step.
        </p>
      </div>

      {/* Empty State */}
      {wishlists.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 bg-base-100 rounded-xl shadow-sm border border-base-200'>
          <HeartOff className='size-16 text-gray-300 mb-4' />
          <h3 className='text-lg font-semibold text-gray-600'>
            Your wishlist is empty
          </h3>
          <p className='text-gray-400 mb-6'>
            Browse scholarships and save them here for later.
          </p>
          <Link to='/scholarships' className='btn btn-primary btn-wide'>
            Browse Scholarships
          </Link>
        </div>
      ) : (
        /* Wishlist Grid */
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {wishlists.map((item) => (
            <div
              key={item._id}
              className='card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-200 group overflow-hidden'
            >
              {/* Image Section */}
              <figure className='relative h-40 overflow-hidden'>
                <img
                  src={item.universityImage}
                  alt={item.universityName}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
                <div className='absolute bottom-3 left-3 text-white'>
                  <div className='badge badge-primary border-none font-semibold text-xs'>
                    {item.scholarshipCategory}
                  </div>
                </div>
              </figure>

              <div className='card-body p-5 relative'>
                <div className='absolute -top-8 right-5 w-12 h-12 rounded-lg border-2 border-white bg-white shadow-md flex items-center justify-center overflow-hidden'>
                  <University className='text-primary size-6' />
                </div>

                {/* Content */}
                <div className='mt-1'>
                  <h2
                    className='text-lg font-bold text-gray-800 line-clamp-1'
                    title={item.universityName}
                  >
                    {item.universityName}
                  </h2>
                  <p className='text-sm font-medium text-primary line-clamp-1'>
                    {item.scholarshipName}
                  </p>
                </div>

                {/* Info Grid */}
                <div className='grid grid-cols-2 gap-y-2 text-xs text-gray-500 my-3'>
                  <div className='flex items-center gap-1.5'>
                    <MapPin className='size-3.5 text-gray-400' />
                    <span className='truncate max-w-[120px]'>{item.state}</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <GraduationCap className='size-3.5 text-gray-400' />
                    <span className='truncate'>{item.subjectCategory}</span>
                  </div>
                  <div className='flex items-center gap-1.5 col-span-2 mt-1'>
                    <Coins className='size-4 text-success' />
                    <span className='font-bold text-base text-success'>
                      ₹
                      {item.scholarshipAmount
                        ? Number(
                            item.scholarshipAmount.toString().replace(/,/g, '')
                          ).toLocaleString('en-IN')
                        : '0'}
                    </span>
                    <span className='text-[10px] text-gray-400 font-normal uppercase'>
                      Scholarship Value
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className='card-actions flex gap-2 mt-auto pt-3 border-t border-base-200'>
                  <Link
                    /* Fix: Changed /scholarship/ to /scholarships/ to match your App router */
                    to={`/scholarships/${item.scholarshipId}`}
                    className='btn btn-sm flex-1 btn-primary text-white'
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className='btn btn-sm btn-square btn-outline btn-error'
                    disabled={deleteMutation.isPending}
                    title='Remove'
                  >
                    <Trash2 className='size-4' />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default WishList;
