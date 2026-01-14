import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import Container from '../../components/Container/Container';
import ScholarshipCard from '../shared/ScholarshipCard/ScholarshipCard';
import Filters from './Filters/Filters';
import { useState } from 'react';
import Search from './Search';
import { Circle } from 'lucide-react';
import Pagination from '../../components/Pagination/Pagination';
import ScholarshipCardSkeleton from '../shared/ScholarshipCard/ScholarshipCardSkeleton';

const AllScholarships = () => {
  const [schCat, setSchCat] = useState('');
  const [subCat, setSubCat] = useState('');
  const [state, setState] = useState(''); // Changed from loc to state
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const axiosInstance = useAxios();
  const limit = 6;

  // 1. Updated queryFn to be more robust
  const { data: scholarships = [], isLoading } = useQuery({
    queryKey: ['scholarships', schCat, subCat, state, search, page],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/scholarships?schCat=${schCat}&subCat=${subCat}&state=${state}&search=${search}&page=${page}&limit=${limit}`
      );

      // Handle Pagination
      if (data?.totalScholaships) {
        const pages = Math.ceil(Number(data.totalScholaships) / limit);
        setTotalPages(pages);
      }

      // Return ONLY the array of scholarships
      // We check for .scholarships first, then .result, then fallback to empty array
      return data?.scholarships || data?.result || [];
    },
  });

  const handleReset = () => {
    setSearch('');
    setSchCat('');
    setSubCat('');
    setState(''); // Reset state;
  };

  const hasActiveFilter = search || schCat || subCat || state;

  return (
    <Container className={'py-20'}>
      {/* Header Section */}
      <div className='text-center mb-12'>
        <div className='badge badge-primary badge-outline mb-4 px-4 py-3 font-semibold'>
          🎓 Your Future Awaits
        </div>
        <h1 className='text-4xl md:text-5xl font-extrabold mb-4 text-base-content'>
          All <span className='text-primary'>Scholarships</span>
        </h1>
        <p className='text-base-content/70 max-w-2xl mx-auto text-lg'>
          Browse through various merit-based scholarships tailored for BTech
          students across{' '}
          <span className='font-semibold text-primary'>
            various Indian states
          </span>
          . Find the perfect funding for your engineering journey.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className='card bg-base-100 shadow-lg border border-base-200 mb-10'>
        <div className='card-body p-4 md:p-6'>
          <div className='flex flex-col lg:flex-row justify-between items-center gap-6'>
            <div className='w-full lg:w-auto flex-1 max-w-lg'>
              <Search setSearch={setSearch} />
            </div>

            <div className='flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto justify-end'>
              <Filters
                setSchCat={setSchCat}
                setSubCat={setSubCat}
                setState={setState} // Passing setState instead of setLoc
              />

              {hasActiveFilter && (
                <button
                  onClick={handleReset}
                  className='btn btn-error btn-outline btn-sm sm:btn-md gap-2 min-w-[100px]'
                >
                  <Circle className='size-4' />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        {isLoading ? (
          [...Array(6)].map((_, index) => (
            <ScholarshipCardSkeleton key={index} />
          ))
        ) : scholarships.length > 0 ? (
          scholarships.map((scholarship) => (
            <ScholarshipCard key={scholarship._id} scholarship={scholarship} />
          ))
        ) : (
          <div className='col-span-full text-center py-20'>
            <p className='text-xl opacity-50'>
              No scholarships found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* pagination  */}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </Container>
  );
};

export default AllScholarships;
