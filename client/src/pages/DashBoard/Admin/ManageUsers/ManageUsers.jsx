import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Search,
  Trash2,
  ShieldCheck,
  UserCheck,
  UserCog,
  Filter,
  Mail,
  Calendar,
  MoreVertical,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Spinner from '../../../../components/Spinner/Spinner';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Fetch Users Data
  const { data, isLoading } = useQuery({
    queryKey: ['users', searchTerm, roleFilter, currentPage],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/users?search=${searchTerm}&filter=${roleFilter}&page=${currentPage}&limit=${limit}`
      );
      return data;
    },
  });

  const users = data?.users || [];
  const totalUsers = data?.totalUsers || 0;

  // Mutation for Role Update
  const { mutate: updateRole } = useMutation({
    mutationFn: async ({ id, newRole }) => {
      const { data } = await axiosSecure.patch(`/users/${id}`, {
        role: newRole,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User role updated successfully!');
    },
    onError: () => toast.error('Failed to update role'),
  });

  // Mutation for Delete User
  const { mutate: deleteUser } = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.delete(`/users/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User deleted permanently');
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be permanently removed from the system.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#3B82F6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id);
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) return <Spinner />;

  return (
    <div className='p-4 md:p-6'>
      {/* Header & Stats */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>
        <div>
          <h1 className='text-2xl font-bold flex items-center gap-2'>
            <Users className='text-primary' />
            Manage Users
          </h1>
          <p className='text-gray-500 mt-1'>
            Total Users Found:{' '}
            <span className='font-semibold text-primary'>{totalUsers}</span>
          </p>
        </div>

        {/* Filters */}
        <div className='flex flex-wrap items-center gap-3'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400' />
            <input
              type='text'
              placeholder='Search name or email...'
              className='input input-bordered input-sm pl-10 w-full max-w-xs focus:outline-none'
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className='select select-bordered select-sm focus:outline-none'
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value=''>All Roles</option>
            <option value='admin'>Admin</option>
            <option value='student'>Student</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className='card bg-base-100 shadow-xl border border-base-200'>
        <div className='overflow-x-auto'>
          <table className='table w-full'>
            <thead className='bg-base-200'>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th className='text-center'>Manage Role</th>
                <th className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr
                  key={userItem._id}
                  className='hover:bg-base-50 transition-colors'
                >
                  {/* User Profile */}
                  <td>
                    <div className='flex items-center gap-3'>
                      <div className='avatar'>
                        <div className='mask mask-squircle w-12 h-12'>
                          <img
                            src={userItem?.photoURL || '/profile.png'}
                            alt={userItem.displayName}
                          />
                        </div>
                      </div>
                      <div>
                        <div className='font-bold'>{userItem.displayName}</div>
                        <div className='text-sm opacity-60 flex items-center gap-1'>
                          <Mail className='size-3' /> {userItem.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role Badge */}
                  <td>
                    <span
                      className={`badge badge-sm font-semibold uppercase ${
                        userItem.role === 'admin'
                          ? 'badge-error text-white'
                          : userItem.role === 'moderator'
                          ? 'badge-warning'
                          : 'badge-ghost'
                      }`}
                    >
                      {userItem.role}
                    </span>
                  </td>

                  {/* Date */}
                  <td>
                    <div className='flex items-center gap-2 text-sm text-gray-500'>
                      <Calendar className='size-4' />
                      {userItem.createdAt
                        ? formatDate(userItem.createdAt)
                        : 'N/A'}
                    </div>
                  </td>

                  {/* Role Actions */}
                  <td className='text-center'>
                    <div className='flex items-center justify-center gap-1'>
                      <button
                        onClick={() =>
                          updateRole({ id: userItem._id, newRole: 'admin' })
                        }
                        className='btn btn-ghost btn-xs text-error hover:bg-error/10'
                        title='Make Admin'
                        disabled={userItem.role === 'admin'}
                      >
                        <ShieldCheck className='size-4' />
                      </button>
                      <button
                        onClick={() =>
                          updateRole({ id: userItem._id, newRole: 'moderator' })
                        }
                        className='btn btn-ghost btn-xs text-warning hover:bg-warning/10'
                        title='Make Moderator'
                        disabled={userItem.role === 'moderator'}
                      >
                        <UserCog className='size-4' />
                      </button>
                      <button
                        onClick={() =>
                          updateRole({ id: userItem._id, newRole: 'student' })
                        }
                        className='btn btn-ghost btn-xs text-info hover:bg-info/10'
                        title='Make Student'
                        disabled={userItem.role === 'student'}
                      >
                        <UserCheck className='size-4' />
                      </button>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className='text-center'>
                    <button
                      onClick={() => handleDelete(userItem._id)}
                      className='btn btn-square btn-ghost btn-sm text-error'
                      title='Delete User'
                    >
                      <Trash2 className='size-4' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {users.length === 0 && (
            <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
              <Users className='size-16 opacity-10 mb-4' />
              <p>No users found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
