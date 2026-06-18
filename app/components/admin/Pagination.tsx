interface PaginationProps {
  info: string;
  current: number;
  pages: number;
  onPage: (p: number) => void;
}

/** Pagination footer — ports renderPageBtns. */
export default function Pagination({ info, current, pages, onPage }: PaginationProps) {
  return (
    <div className="pagination">
      <span>{info}</span>
      <div className="page-btns">
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <div
            key={p}
            className={"page-btn" + (p === current ? " active" : "")}
            onClick={() => onPage(p)}
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Slice an array for the given 1-based page. Ports paginate(). */
export function paginate<T>(arr: T[], page: number, perPage = 8) {
  const start = (page - 1) * perPage;
  return {
    items: arr.slice(start, start + perPage),
    total: arr.length,
    pages: Math.max(1, Math.ceil(arr.length / perPage)),
  };
}
