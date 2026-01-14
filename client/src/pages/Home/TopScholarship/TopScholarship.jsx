import { useQuery } from '@tanstack/react-query';
import Container from '../../../components/Container/Container';
import ScholarshipCard from '../../shared/ScholarshipCard/ScholarshipCard';
import ScholarshipCardSkeleton from '../../shared/ScholarshipCard/ScholarshipCardSkeleton';
import useAxios from '../../../hooks/useAxios';

const TopScholarships = () => {
  const axiosInstance = useAxios();

  const { data, isLoading } = useQuery({
    queryKey: ['top-scholarships'],
    queryFn: async () => {
      const res = await axiosInstance.get('/scholarships?limit=6');
      return res.data; // ✅ FULL RESPONSE
    },
  });

  const scholarships = data?.data || [];

  return (
    <Container className='py-20'>
      <div className='text-center mb-12'>
        <h2 className='text-3xl font-bold'>
          Top <span className='text-primary'>Scholarships</span>
        </h2>
        <p className='opacity-70 max-w-2xl mx-auto mt-3'>
          Featured opportunities for B.Tech students across India.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {isLoading
          ? [...Array(6)].map((_, i) => <ScholarshipCardSkeleton key={i} />)
          : scholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship._id}
                scholarship={scholarship}
              />
            ))}
      </div>
    </Container>
  );
};

export default TopScholarships;
