import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import {
  GraduationCap,
  University,
  DollarSign,
  CheckCircle,
  Plus,
  X,
  Loader2,
  ArrowLeft,
  Save,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Lottie from 'lottie-react';
import Loading from '../../../../assets/animations/Loading.json';

const EditScholarship = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [includes, setIncludes] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Fetch existing scholarship data
  const { data: scholarship, isLoading } = useQuery({
    queryKey: ['scholarship', id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/scholarship/${id}`);
      return data;
    },
  });

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

  // Map loaded data to form fields
  useEffect(() => {
    if (scholarship) {
      setValue('scholarshipName', scholarship.scholarshipName);
      setValue('universityName', scholarship.universityName);
      setValue('universityImage', scholarship.universityImage);
      setValue('state', scholarship.state);
      setValue('subjectCategory', scholarship.subjectCategory);
      setValue('scholarshipCategory', scholarship.scholarshipCategory);
      setValue('scholarshipAmount', scholarship.scholarshipAmount);
      setValue('applicationFees', scholarship.applicationFees);
      setValue(
        'applicationDeadline',
        scholarship.applicationDeadline?.split('T')[0]
      );

      if (scholarship.includes?.length > 0) {
        setIncludes(scholarship.includes);
      }
    }
  }, [scholarship, setValue]);

  const handleAddInclude = () => setIncludes([...includes, '']);
  const handleRemoveInclude = (index) => {
    if (includes.length > 1)
      setIncludes(includes.filter((_, i) => i !== index));
  };
  const handleIncludeChange = (index, value) => {
    const newIncludes = [...includes];
    newIncludes[index] = value;
    setIncludes(newIncludes);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const filteredIncludes = includes.filter((item) => item.trim() !== '');

    if (filteredIncludes.length === 0) {
      toast.error('Please add at least one facility/benefit');
      setIsSubmitting(false);
      return;
    }

    const updatedData = {
      scholarshipName: data.scholarshipName,
      universityName: data.universityName,
      universityImage: data.universityImage, // Assuming you handle image update separately if file is chosen
      state: data.state,
      subjectCategory: data.subjectCategory,
      scholarshipCategory: data.scholarshipCategory,
      scholarshipAmount: parseInt(data.scholarshipAmount) || 0,
      applicationFees: parseInt(data.applicationFees) || 0,
      applicationDeadline: new Date(data.applicationDeadline).toISOString(),
      includes: filteredIncludes,
    };

    try {
      const { data } = await axiosSecure.patch(
        `/scholarship/${id}`,
        updatedData
      );
      if (data.modifiedCount > 0) {
        toast.success('Scholarship updated successfully!');
        navigate('/dashboard/manage-scholarships');
      } else {
        toast('No changes were made.', { icon: 'ℹ️' });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update scholarship');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[calc(100vh-130px)]'>
        <Lottie animationData={Loading} loop className='w-40' />
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <div className='flex items-center gap-4 mb-6'>
        <button
          onClick={() => navigate(-1)}
          className='btn btn-ghost btn-circle'
        >
          <ArrowLeft className='size-5' />
        </button>
        <div>
          <h1 className='text-2xl font-bold flex items-center gap-2'>
            <GraduationCap className='text-primary' /> Edit Scholarship
          </h1>
          <p className='text-gray-500 mt-1'>
            Update details for {scholarship?.scholarshipName}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Section 1: General Info */}
        <div className='card bg-base-100 shadow border'>
          <div className='card-body'>
            <h2 className='card-title text-lg border-b pb-2 mb-4'>
              <University className='size-5 text-primary' /> Basic Information
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='form-control md:col-span-2'>
                <label className='label'>
                  <span className='label-text font-medium'>
                    Scholarship Name *
                  </span>
                </label>
                <input
                  {...register('scholarshipName', { required: 'Required' })}
                  className='input input-bordered'
                />
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-medium'>
                    University Name *
                  </span>
                </label>
                <input
                  {...register('universityName', { required: 'Required' })}
                  className='input input-bordered'
                />
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-medium'>State *</span>
                </label>
                <select
                  {...register('state', { required: 'Required' })}
                  className='select select-bordered'
                >
                  <option value=''>Select State</option>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-medium'>
                    Subject Category *
                  </span>
                </label>
                <select
                  {...register('subjectCategory', { required: 'Required' })}
                  className='select select-bordered'
                >
                  {subjectCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-medium'>
                    Scholarship Category *
                  </span>
                </label>
                <select
                  {...register('scholarshipCategory', { required: 'Required' })}
                  className='select select-bordered'
                >
                  {scholarshipCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Financials */}
        <div className='card bg-base-100 shadow border'>
          <div className='card-body'>
            <h2 className='card-title text-lg border-b pb-2 mb-4'>
              <DollarSign className='size-5 text-primary' /> Financials & Media
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-medium'>
                    Scholarship Amount (₹) *
                  </span>
                </label>
                <input
                  type='number'
                  {...register('scholarshipAmount', { required: 'Required' })}
                  className='input input-bordered'
                />
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-medium'>
                    Application Fees (₹)
                  </span>
                </label>
                <input
                  type='number'
                  {...register('applicationFees')}
                  className='input input-bordered'
                />
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-medium'>
                    Application Deadline *
                  </span>
                </label>
                <input
                  type='date'
                  {...register('applicationDeadline', { required: 'Required' })}
                  className='input input-bordered'
                />
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-medium'>Image URL *</span>
                </label>
                <input
                  type='url'
                  {...register('universityImage', { required: 'Required' })}
                  className='input input-bordered'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Benefits */}
        <div className='card bg-base-100 shadow border'>
          <div className='card-body'>
            <h2 className='card-title text-lg border-b pb-2 mb-4'>
              <CheckCircle className='size-5 text-primary' /> Benefits Included
            </h2>
            <div className='space-y-3'>
              {includes.map((item, index) => (
                <div key={index} className='flex gap-2'>
                  <input
                    value={item}
                    onChange={(e) => handleIncludeChange(index, e.target.value)}
                    className='input input-bordered w-full'
                    placeholder='Benefit detail...'
                  />
                  {includes.length > 1 && (
                    <button
                      type='button'
                      onClick={() => handleRemoveInclude(index)}
                      className='btn btn-error btn-square btn-sm'
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type='button'
                onClick={handleAddInclude}
                className='btn btn-outline btn-sm gap-2 mt-2'
              >
                <Plus size={16} /> Add Benefit
              </button>
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-3'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='btn btn-ghost'
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='btn btn-primary min-w-[150px]'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className='animate-spin' />
            ) : (
              <>
                <Save size={18} /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditScholarship;
