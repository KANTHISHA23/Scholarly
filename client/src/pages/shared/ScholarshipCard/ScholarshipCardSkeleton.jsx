const ScholarshipCardSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow-xl overflow-hidden h-full">
      {/* Image Skeleton */}
      <div className="skeleton h-52 w-full rounded-none"></div>

      {/* Card Body */}
      <div className="card-body p-5">
        {/* University Info Row (Avatar + Text + Badge) */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="skeleton w-10 h-10 rounded-full shrink-0"></div>

          {/* Text Info */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="skeleton h-4 w-3/4"></div>
            <div className="skeleton h-3 w-1/2"></div>
          </div>

          {/* Badge */}
          <div className="skeleton h-5 w-16 rounded-full"></div>
        </div>

        {/* Title (Matches min-h-14) */}
        <div className="mt-4 flex flex-col gap-2 min-h-14">
          <div className="skeleton h-6 w-full"></div>
          <div className="skeleton h-6 w-2/3"></div>
        </div>

        {/* Info Row (Date, Applicants, Ratings) */}
        <div className="flex items-center justify-between mt-2">
          <div className="skeleton h-4 w-24"></div>
          <div className="skeleton h-4 w-12"></div>
          <div className="skeleton h-4 w-10"></div>
        </div>

        {/* Button Skeleton */}
        <div className="mt-4">
          <div className="skeleton h-12 w-full rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipCardSkeleton;
