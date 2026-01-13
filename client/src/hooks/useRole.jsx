import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useRole = () => {
  const { user, loading } = useAuth(); // Ensure you have access to auth loading state
  const axiosSecure = useAxiosSecure();

  const { data: role, isLoading: roleLoading } = useQuery({
    // 1. Only use user.email in the key to prevent unnecessary re-fetches
    queryKey: ['role', user?.email],

    // 2. The 'enabled' property prevents the query from running
    // until the user email is actually available.
    enabled: !loading && !!user?.email,

    queryFn: async () => {
      const { data } = await axiosSecure.get(`/users/${user?.email}/role`);

      // 3. Explicitly return a value or a default to avoid 'undefined'
      return data?.role || 'student';
    },
    // 4. Set a staleTime to prevent flickering on every render
    staleTime: 1000 * 60 * 5,
  });

  return { role, roleLoading };
};

export default useRole;
