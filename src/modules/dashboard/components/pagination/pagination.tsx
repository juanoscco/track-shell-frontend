import { useCallback, useEffect, useState } from 'react';

interface UsePaginationProps {
    initialPageSize?: number;
    initialPage?: number;
    initialSearch?: string;
    initialFilter?: string;
    currentPageSize?: number; // Para sincronizar con datos externos si es necesario
  }
  
  export const usePagination = ({
    initialPageSize = 10,
    initialPage = 1,
    initialSearch = "",
    initialFilter = "",
    currentPageSize,
  }: UsePaginationProps) => {
    const [pageSize, setPageSize] = useState(initialPageSize); // Tamaño de página
    const [page, setPage] = useState(initialPage); // Página actual
    const [search, setSearch] = useState(initialSearch); // Búsqueda
    const [filter, setFilter] = useState(initialFilter); // Filtro
  
    const handlePageChange = useCallback((newPage: number) => {
      setPage(newPage);
    }, []);
  
    const handlePageSizeChange = (newSize: number) => {
      setPageSize(newSize); // Cambia el tamaño de la página
      setPage(1); // Resetea a la primera página cuando se cambia el tamaño de la página
    };
  
    const handleSearch = () => {
      setFilter(search); // Establece el filtro cuando se hace clic en "Buscar"
    };
  
    // Sincroniza pageSize con currentPageSize si es necesario
    useEffect(() => {
      if (currentPageSize && currentPageSize !== pageSize) {
        setPageSize(currentPageSize);
      }
    }, [currentPageSize, pageSize]);
  
    return {
      page,
      pageSize,
      search,
      filter,
      setSearch,
      setFilter,
      handlePageChange,
      handlePageSizeChange,
      handleSearch,
    };
  };