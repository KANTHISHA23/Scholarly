import { StepBack, StepForward } from "lucide-react";

const Pagination = ({ page, setPage, totalPages }) => {
  return (
    <div className="flex items-center  justify-center gap-4 p-2 mt-5">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="btn hover:btn-primary btn-sm"
      >
        <StepBack className="size-5" />
      </button>
      <div className="flex items-center justify-center gap-4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`btn hover:btn-primary rounded-full shadow-sm ${
              page - 1 === i && "btn-primary"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="btn hover:btn-primary btn-sm"
      >
        <StepForward className="size-5" />
      </button>
    </div>
  );
};

export default Pagination;
