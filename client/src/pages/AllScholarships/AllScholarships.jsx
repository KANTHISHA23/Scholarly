import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Container from '../../components/Container/Container';
import ScholarshipCard from '../shared/ScholarshipCard/ScholarshipCard';
import ScholarshipCardSkeleton from '../shared/ScholarshipCard/ScholarshipCardSkeleton';
import Filters from './Filters/Filters';
import Search from './Search';
import Pagination from '../../components/Pagination/Pagination';
import useAxios from '../../hooks/useAxios';
import { Circle } from 'lucide-react';

const AllScholarships = () => {
  const axiosInstance = useAxios();

  const [schCat, setSchCat] = useState('');
  const [subCat, setSubCat] = useState('');
  const [state, setState] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const limit = 6;

  const { data, isLoading } = useQuery({
    queryKey: ['scholarships', schCat, subCat, state, search, page],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/scholarships?schCat=${schCat}&subCat=${subCat}&state=${state}&search=${search}&page=${page}&limit=${limit}`
      );
      return res.data; // ✅ ENTIRE RESPONSE
    },
    keepPreviousData: true,
  });

  const scholarships = data?.data || [];
  const totalPages = Math.ceil((data?.meta?.total || 0) / limit);

  const handleReset = () => {
    setSearch('');
    setSchCat('');
    setSubCat('');
    setState('');
    setPage(1);
  };

  const hasActiveFilter = search || schCat || subCat || state;

  return (
    <Container className='py-20'>
      {/* Header */}
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-extrabold'>
          All <span className='text-primary'>Scholarships</span>
        </h1>
        <p className='opacity-70 max-w-2xl mx-auto mt-3'>
          Browse verified B.Tech scholarships across Indian states.
        </p>
      </div>

      {/* Search + Filters */}
      <div className='card bg-base-100 shadow mb-10'>
        <div className='card-body flex flex-col lg:flex-row gap-6'>
          <Search setSearch={setSearch} />

          <Filters
            setSchCat={setSchCat}
            setSubCat={setSubCat}
            setState={setState}
          />

          {hasActiveFilter && (
            <button
              onClick={handleReset}
              className='btn btn-outline btn-error gap-2'
            >
              <Circle size={16} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Scholarships Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {isLoading ? (
          [...Array(6)].map((_, i) => <ScholarshipCardSkeleton key={i} />)
        ) : scholarships.length > 0 ? (
          scholarships.map((scholarship) => (
            <ScholarshipCard key={scholarship._id} scholarship={scholarship} />
          ))
        ) : (
          <div className='col-span-full text-center py-20 opacity-50'>
            No scholarships found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      )}
    </Container>
  );
};

export default AllScholarships;
