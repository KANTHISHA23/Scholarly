import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState, useRef } from "react";
import { Link } from "react-router";
import SearchInput from "../../AllScholarships/Search";
import searchLoading from "../../../assets/animations/searchLoading.json";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  GraduationCap,
  AlertTriangle,
  X,
  CircleX,
} from "lucide-react";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import useAuth from "../../../hooks/useAuth";
import Pagination from "../../../components/Pagination/Pagination";

const ManageScholarships = () => {
  const [schCat, setSchCat] = useState("");
  const [subCat, setSubCat] = useState("");
  const [loc, setLoc] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const { user } = useAuth();
  const deleteModalRef = useRef(null);
  const axiosSecure = useAxiosSecure();
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
  const [page, setPage] = useState(1);
  const {
    data: scholarships = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["scholarships", schCat, subCat, loc, search, sort, limit, page],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/scholarships?schCat=${schCat}&subCat=${subCat}&loc=${loc}&sort=${sort}&search=${search}&limit=${limit}&page=${page}`
      );
      const pages = Math.ceil(Number(data.totalScholaships) / limit);
      setTotalPages(pages);
      return data.scholarships;
    },
  });
  console.log(totalPages);
  // Options
   const subjectCategories = [
     'Computer Science & IT',
     'Electronics & Communication',
     'Mechanical & Civil',
     'Electrical & Instrumentation',
     'Emerging Tech (AI/ML/Data Science)',
     'Core Engineering (Chemical/Metallurgy)',
   ];

   const scholarshipCategories = [
     'Government',
     'Corporate CSR',
     'Institutional',
     'NGO',
   ];

   const states = [
     'Andhra Pradesh',
     'Arunachal Pradesh',
     'Assam',
     'Bihar',
     'Chhattisgarh',
     'Goa',
     'Gujarat',
     'Haryana',
     'Himachal Pradesh',
     'Jharkhand',
     'Karnataka',
     'Kerala',
     'Madhya Pradesh',
     'Maharashtra',
     'Manipur',
     'Meghalaya',
     'Mizoram',
     'Nagaland',
     'Odisha',
     'Punjab',
     'Rajasthan',
     'Sikkim',
     'Tamil Nadu',
     'Telangana',
     'Tripura',
     'Uttar Pradesh',
     'Uttarakhand',
     'West Bengal',
     'Delhi',
     'Jammu and Kashmir',
     'Ladakh',
     'Others',
   ];
  

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSchCat("");
    setSubCat("");
    setLoc("");
    setSearch("");
    setSort("");
  };

  // Check if any filter is active
  const hasActiveFilters = schCat || subCat || loc || search || sort;

  // Handle delete
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    deleteModalRef.current?.showModal();
  };

  const confirmDelete = async () => {
    try {
      const { data } = await axiosSecure.delete(
        `/scholarship/${deleteId}?adminEmail=${user?.email}`
      );
      if (data.deletedCount) {
        toast.success("Scholarship deleted successfully!");
        refetch();
        deleteModalRef.current?.close();
        setDeleteId(null);
      }
    } catch (error) {
      toast.error("Failed to delete scholarship");
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
        <div>
          <h1 className='text-2xl font-bold flex items-center gap-2'>
            <GraduationCap className='text-primary' />
            Manage Scholarships
          </h1>
          <p className='text-gray-500 mt-1'>
            {scholarships.length} scholarships found
          </p>
        </div>

        <Link
          to='/dashboard/add-scholarship'
          className='btn btn-primary gap-2 w-fit'
        >
          <Plus className='size-4' />
          Add Scholarship
        </Link>
      </div>

      {/* Filters Section */}
      <div className='card bg-base-100 shadow mb-6'>
        <div className='card-body py-4'>
          {/* Search */}
          <div className='flex gap-3 mb-4'>
            <div className='join flex-1'>
              <SearchInput
                setSearch={setSearch}
                className={'w-full rounded-l-sm'}
              />
              <button className='btn btn-primary join-item'>
                <Search className='size-4' />
              </button>
            </div>
          </div>

          {/* Filter Row */}
          <div className='flex flex-wrap gap-3'>
            {/* Scholarship Category */}
            <select
              className='select select-bordered select-sm focus:outline-none'
              value={schCat}
              onChange={(e) => setSchCat(e.target.value)}
            >
              <option value=''>All Categories</option>
              {scholarshipCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Subject Category */}
            <select
              className='select select-bordered select-sm focus:outline-none'
              value={subCat}
              onChange={(e) => setSubCat(e.target.value)}
            >
              <option value=''>All Subjects</option>
              {subjectCategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            {/* Location */}
            <select
              className='select select-bordered select-sm focus:outline-none'
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
            >
              <option value=''>All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>


            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className='btn btn-ghost btn-sm gap-1 text-error'
              >
                <X className='size-4' />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className='card bg-base-100 shadow'>
        <div className='card-body p-0'>
          {isLoading ? (
            /* Loading State */
            <div className='flex items-center justify-center h-[52vh]'>
              <Lottie animationData={searchLoading} loop className='w-40' />
            </div>
          ) : scholarships.length === 0 ? (
            /* Empty State */
            <div className='flex flex-col items-center justify-center py-20 text-gray-500'>
              <GraduationCap className='size-16 mb-4 opacity-50' />
              <p className='text-lg font-medium'>No scholarships found</p>
              <p className='text-sm'>Try adjusting your filters</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className='btn btn-primary btn-sm mt-4'
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            /* Table */
            <div className='overflow-x-auto'>
              <table className='table'>
                {/* Head */}
                <thead className='bg-base-200'>
                  <tr>
                    <th>#</th>
                    <th>Scholarship</th>
                    <th>University</th>
                    <th>Category</th>
                    <th>Degree</th>
                    <th> Scholarship Amount</th>
                    <th>Deadline</th>
                    <th className='text-center'>Actions</th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {scholarships.map((scholarship, index) => (
                    <tr key={scholarship._id} className='hover'>
                      {/* Serial */}
                      <td className='font-medium'>{index + 1}</td>

                      {/* Scholarship Name with Image */}
                      <td>
                        <div className='flex items-center gap-3'>
                          <div className='avatar'>
                            <div className='w-12 h-12 rounded-lg'>
                              <img
                                src={scholarship.universityImage}
                                alt={scholarship.scholarshipName}
                                onError={(e) =>
                                  (e.target.src = '/placeholder.png')
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <p className='font-medium line-clamp-1 max-w-[200px]'>
                              {scholarship.scholarshipName}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {scholarship.subjectCategory}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* University */}
                      <td>
                        <p className='font-medium line-clamp-1 max-w-[150px]'>
                          {scholarship.universityName}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {scholarship.universityCity},{' '}
                          {scholarship.state}
                        </p>
                      </td>

                      {/* Category Badge */}
                      <td>
                        <span
                          className={`badge badge-sm ${'badge-ghost'
                          }`}
                        >
                          {scholarship.scholarshipCategory}
                        </span>
                      </td>

                      {/* Degree */}
                      <td>
                        <span className='badge badge-outline badge-sm p-5'>
                          {scholarship.degree}
                        </span>
                      </td>

                      {/* Scholarship Amount*/}
                      <td>
                        <p className='font-medium'>
                          ₹{scholarship.scholarshipAmount}
                        </p>
                      </td>

                      {/* Deadline */}
                      <td>
                        <p className='text-sm'>
                          {formatDate(scholarship.applicationDeadline)}
                        </p>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className='flex items-center justify-center gap-1'>
                          {/* View */}
                          <Link
                            to={`/scholarship/${scholarship._id}`}
                            className='btn btn-ghost btn-sm btn-square text-info'
                            title='View'
                          >
                            <Eye className='size-4' />
                          </Link>

                          {/* Edit */}
                          <Link
                            to={`/dashboard/edit-scholarship/${scholarship._id}`}
                            className='btn btn-ghost btn-sm btn-square text-warning'
                            title='Edit'
                          >
                            <Edit className='size-4' />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteClick(scholarship._id)}
                            className='btn btn-ghost btn-sm btn-square text-error'
                            title='Delete'
                          >
                            <Trash2 className='size-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* pagination  */}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />

      {/* Delete Confirmation Modal */}
      <dialog
        ref={deleteModalRef}
        className='modal modal-bottom sm:modal-middle'
      >
        <div className='modal-box'>
          <div className='flex flex-col items-center text-center'>
            <div className='w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4'>
              <AlertTriangle className='size-8 text-error' />
            </div>
            <h3 className='font-bold text-lg'>Delete Scholarship</h3>
            <p className='py-4 text-gray-500'>
              Are you sure you want to delete this scholarship? This action
              cannot be undone.
            </p>
          </div>

          <div className='modal-action justify-center'>
            <form method='dialog'>
              <button className='btn gap-2'>
                <CircleX className='size-4' />
                Cancel
              </button>
            </form>
            <button onClick={confirmDelete} className='btn btn-error gap-2'>
              <Trash2 className='size-4' />
              Delete
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

export default ManageScholarships;
