import React, { useState, useEffect, useMemo } from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

// Define an interface for the component props
interface PaginationComponentProps {
  total: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void; // Defines a function that takes a number and returns void
}

// Use the interface in your function component
const PaginationComponent: React.FC<PaginationComponentProps> = ({
  total = 0,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
}) => {
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (total > 0 && itemsPerPage > 0) {
      setTotalPages(Math.ceil(total / itemsPerPage));
    }
  }, [total, itemsPerPage]);

  const paginationItems = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem
          key={i}
          active={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          <PaginationLink onClick={() => onPageChange(i)}>{i}</PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  }, [totalPages, currentPage, onPageChange]);

  if (totalPages === 0) return null;

  return (
    <Pagination>
      <PaginationItem>
        <PaginationLink
          previous
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
      </PaginationItem>
      {paginationItems}
      <PaginationItem>
        <PaginationLink
          next
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </PaginationItem>
    </Pagination>
  );
};

export default PaginationComponent;