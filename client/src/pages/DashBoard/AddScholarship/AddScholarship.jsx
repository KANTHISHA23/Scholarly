import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import {
  GraduationCap,
  University,
  Plus,
  X,
  Loader2,
  CheckCircle,
  IndianRupee,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage } from '../../../utils';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AddScholarship = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [includes, setIncludes] = useState(['']);
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

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
    setIsLoading(true);
    const filteredIncludes = includes.filter((item) => item.trim() !== '');

    if (filteredIncludes.length === 0) {
      toast.error('Please add at least one facility/benefit');
      setIsLoading(false);
      return;
    }

    try {
      const imgFile = data.universityImage[0];
      const universityImageUrl = await uploadImage(imgFile);

      const scholarshipData = {
        scholarshipName: data.scholarshipName,
        universityName: data.universityName,
        universityImage: universityImageUrl,
        state: data.state,
        subjectCategory: data.subjectCategory,
        scholarshipCategory: data.scholarshipCategory,
        scholarshipAmount: parseInt(data.scholarshipAmount) || 0,
        applicationFees: parseInt(data.applicationFees) || 0,
        applicationDeadline: new Date(data.applicationDeadline).toISOString(),
        scholarshipPostDate: new Date().toISOString(),
        postedUserEmail: user?.email,
        applicantNumber: 0,
        ratings: 0,
        includes: filteredIncludes,
      };

      const response = await axiosSecure.post(
        '/add-scholarship',
        scholarshipData
      );
      if (response.data.insertedId) {
        toast.success('Scholarship added successfully!');
        reset();
        setIncludes(['']);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add scholarship.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <div className='mb-8 text-center md:text-left'>
        <h1 className='text-2xl font-bold flex items-center justify-center md:justify-start gap-2'>
          <GraduationCap className='text-primary' />
          Add Scholarship
        </h1>
        <p className='text-gray-500 mt-1'>
          Fill details for the scholarship program
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Section 1: Scholarship & University Basic Info */}
        <div className='card bg-base-100 shadow-md border'>
          <div className='card-body'>
            <h2 className='card-title text-lg border-b pb-2 mb-4'>
              <University className='size-5 text-primary' /> General Information
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
                  className='input input-bordered focus:border-primary'
                  placeholder='e.g. State Merit Scholarship'
                />
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text font-medium'>
                    University/Institute Name *
                  </span>
                </label>
                <input
                  {...register('universityName', { required: 'Required' })}
                  className='input input-bordered'
                  placeholder='Full name of institution'
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
                  <option value=''>Select Category</option>
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
                  <option value=''>Select Type</option>
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

        {/* Section 2: Financials & Media */}
        <div className='card bg-base-100 shadow-md border'>
          <div className='card-body'>
            <h2 className='card-title text-lg border-b pb-2 mb-4'>
              <IndianRupee className='size-5 text-primary' /> Financials &
              Deadlines
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
                  {...register('scholarshipAmount', {
                    required: 'Required',
                    min: 0,
                  })}
                  className='input input-bordered'
                  placeholder='e.g. 50000'
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
                  <span className='label-text font-medium'>
                    University/Logo Image *
                  </span>
                </label>
                <input
                  type='file'
                  {...register('universityImage', { required: 'Required' })}
                  className='file-input file-input-bordered w-full'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Benefits */}
        <div className='card bg-base-100 shadow-md border'>
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
                    placeholder='e.g. Free Laptop, Monthly Stipend'
                  />
                  {includes.length > 1 && (
                    <button
                      type='button'
                      onClick={() => handleRemoveInclude(index)}
                      className='btn btn-error btn-square btn-sm'
                    >
                      <X />
                    </button>
                  )}
                </div>
              ))}
              <button
                type='button'
                onClick={handleAddInclude}
                className='btn btn-outline btn-sm gap-2'
              >
                <Plus size={16} /> Add Benefit
              </button>
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-4'>
          <button
            type='button'
            onClick={() => reset()}
            className='btn btn-ghost'
            disabled={isLoading}
          >
            Reset
          </button>
          <button
            type='submit'
            className='btn btn-primary px-10'
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className='animate-spin' />
            ) : (
              'Post Scholarship'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddScholarship;
