import { Link } from 'react-router';
import {
  FaCalendarAlt,
  FaArrowRight,
  FaUniversity,
  FaMapMarkerAlt,
  FaStar,
  FaAward,
} from 'react-icons/fa';
import { FaIndianRupeeSign } from 'react-icons/fa6';

const ScholarshipCard = ({ scholarship }) => {
  const {
    _id,
    scholarshipName,
    universityName,
    state, 
    universityImage,
    scholarshipCategory,
    subjectCategory,
    degree,
    scholarshipAmount, 
    applicationDeadline,
    ratings,
    description,
  } = scholarship || {};

  const getDaysRemaining = (deadline) => {
    if (!deadline) return 0;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining(applicationDeadline);

  return (
    <div className='card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden border border-base-200'>
      <figure className='relative h-48 overflow-hidden'>
        <img
          src={
            universityImage ||
            `https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600`
          }
          alt={scholarshipName}
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
        />
        <div className='absolute top-3 left-3 flex gap-2'>
          <span className='badge badge-primary font-bold py-3 shadow-lg border-none'>
            {scholarshipCategory}
          </span>
        </div>
      </figure>

      <div className='card-body p-5'>
        <div className='flex items-start gap-3'>
          <div className='bg-primary/10 p-2 text-primary rounded-lg shrink-0'>
            <FaUniversity size={18} />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='font-bold text-xs truncate uppercase text-base-content/70'>
              {universityName}
            </p>
            <div className='flex items-center gap-1 text-xs text-gray-500'>
              <FaMapMarkerAlt className='text-secondary' />
              <span>{state}</span> •{' '}
              <span className='font-medium text-primary'>{degree}</span>
            </div>
          </div>
        </div>

        <h3 className='card-title text-lg mt-2 line-clamp-2 min-h-[3rem] leading-tight'>
          {scholarshipName}
        </h3>

        <p className='text-xs text-gray-500 line-clamp-1 italic'>
          {subjectCategory}
        </p>

        <div className='flex items-center justify-between mt-4 bg-base-200/50 p-3 rounded-xl'>
          <div className='flex flex-col'>
            <span className='text-[10px] uppercase font-bold text-gray-500'>
              Amount
            </span>
            <div className='flex items-center gap-1 text-xl font-black text-emerald-600'>
              <FaIndianRupeeSign className='text-sm' />
              <span>{scholarshipAmount}</span>
            </div>
          </div>
          <div className='text-right'>
            <span className='text-[10px] uppercase font-bold text-gray-500'>
              Deadline
            </span>
            <p
              className={`text-xs font-bold ${
                daysRemaining < 10 ? 'text-error' : 'text-base-content'
              }`}
            >
              {new Date(applicationDeadline).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
              })}
            </p>
          </div>
        </div>

        <div className='flex items-center justify-between mt-4 px-1 text-xs'>
          <div className='flex items-center gap-1'>
            <FaStar className='text-warning' />
            <span className='font-bold'>{ratings}</span>
          </div>
          <div className='flex items-center gap-1 text-gray-500'>
            <FaCalendarAlt />
            <span>
              {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
            </span>
          </div>
        </div>

        <div className='card-actions mt-5'>
          <Link
            to={`/scholarships/${_id}`}
            className='btn btn-primary btn-block rounded-xl group font-bold'
          >
            See Details
            <FaArrowRight className='group-hover:translate-x-1 transition-transform' />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipCard;
