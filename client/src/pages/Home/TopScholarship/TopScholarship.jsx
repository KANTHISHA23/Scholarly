import { useQuery } from "@tanstack/react-query";
import Container from "../../../components/Container/Container";
import useAxios from "../../../hooks/useAxios";
import ScholarshipCard from "../../shared/ScholarshipCard/ScholarshipCard";
import ScholarshipCardSkeleton from "../../shared/ScholarshipCard/ScholarshipCardSkeleton";
const TopScholarship = () => {
  const axiosInstance = useAxios();
  const {
    data: scholarships = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['scholarships'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/scholarships?limit=6');
      return data.scholarships;
    },
  });

  return (
    <Container className={'py-20'}>
      {/* Section Header */}
      <div className='text-center mb-12'>
        <h2 className='text-3xl md:text-4xl font-bold mb-4'>
          Top <span className='text-primary'>Scholarships</span>
        </h2>
        <p className='text-gray-500 max-w-2xl mx-auto'>
          Explore top scholarships and career opportunities for B.Tech students
          across India. Begin your path to innovation and excellence today.
        </p>
      </div>

      {/* Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {isLoading || isFetching
          ? [...Array(6)].map((_, index) => (
              <ScholarshipCardSkeleton key={index} />
            ))
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

export default TopScholarship;
