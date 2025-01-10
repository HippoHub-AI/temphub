import { PrevIcon, NextIcon } from "svg";

interface PaginationProps {
  resultsPerPage: number;
  setResultsPerPage: (value: number) => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  totalRecords: number;
  fetchData: (params: {
    paginationNumber: number;
    pageNo: number;
  }) => Promise<any>;
}

const CustomPagination = ({
  resultsPerPage,
  setResultsPerPage,
  currentPage,
  setCurrentPage,
  totalRecords,
  fetchData,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalRecords / resultsPerPage);

  return (
    <div className="flex justify-between items-center pt-4 pb-8 px-4">
      <div>
        <label htmlFor="results-per-page" className="mr-2">
          Results per page:
        </label>
        <select
          id="results-per-page"
          value={resultsPerPage}
          onChange={async (e) => {
            const newResultsPerPage = Number(e.target.value);
            setResultsPerPage(newResultsPerPage);
            setCurrentPage(1);
            await fetchData({ paginationNumber: newResultsPerPage, pageNo: 1 });
          }}
          className="border px-2 py-1 rounded outline-none"
        >
          {[5, 10, 15, 20, 25, 30]?.map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span>
          {totalRecords > 0
            ? `${(currentPage - 1) * resultsPerPage + 1}-${Math.min(
                currentPage * resultsPerPage,
                totalRecords,
              )} of ${totalRecords}`
            : "No Records Found"}
        </span>
      </div>

      <div>
        <button
          onClick={async () => {
            const newPage = Math.max(currentPage - 1, 1);
            setCurrentPage(newPage);
            await fetchData({
              paginationNumber: resultsPerPage,
              pageNo: newPage,
            });
          }}
          type="button"
          disabled={currentPage === 1}
          className={currentPage === 1 ? "cursor-not-allowed" : ""}
        >
          <PrevIcon />
        </button>

        <button
          onClick={async () => {
            const newPage = Math.min(currentPage + 1, totalPages);
            setCurrentPage(newPage);
            await fetchData({
              paginationNumber: resultsPerPage,
              pageNo: newPage,
            });
          }}
          type="button"
          disabled={currentPage === totalPages}
          className={currentPage === totalPages ? "cursor-not-allowed" : ""}
        >
          <NextIcon />
        </button>
      </div>
    </div>
  );
};

export default CustomPagination;
