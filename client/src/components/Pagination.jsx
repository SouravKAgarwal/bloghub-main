import useStore from "../store";

const Pagination = ({ totalPages, onPageChange }) => {
  const { theme } = useStore();
  const searchParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const showEllipses = totalPages > 8;
  return (
    <div className="pagination">
      <button
        className={`pagination-btn ${theme}`}
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {showEllipses && currentPage > 4 && (
        <>
          <button
            className={`pagination-btn ${theme}`}
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          <span className={`pagination-ellipsis ${theme}`}>...</span>
        </>
      )}

      {range(
        Math.max(1, currentPage - 2),
        Math.min(totalPages, currentPage + 4)
      ).map((page, index) => (
        <button
          key={index}
          className={`pagination-btn ${
            page === currentPage ? "active" : theme
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {showEllipses && currentPage < totalPages - 3 && (
        <>
          <span className={`pagination-ellipsis ${theme}`}>...</span>
          <button
            className={`pagination-btn ${theme}`}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className={`pagination-btn ${theme}`}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
