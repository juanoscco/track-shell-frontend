
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Column<T> {
  header: string;
  accessor?: keyof T;
  id?: string;
  cell?: (props: { row: { original: T } }) => React.ReactNode;
}


interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  filter: string; // Reemplazado 'onSearch' por 'filter'
  setFilter: (filter: string) => void; // Reemplazado 'onSearch' por 'setFilter'
  onPageChange: (page: number) => void;
  handleSearch: () => void;
  onPageSizeChange: (size: number) => void;
}


export function DataTable<T>({
  columns,
  data,
  total,
  currentPage,
  totalPages,
  pageSize,
  filter,
  setFilter,
  handleSearch,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<T>) {


  return (
    <div className="space-y-8">
      <div className="flex gap-2">
        <Input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Buscar..."
          className="max-w-sm"
        />
        <Button onClick={handleSearch}>Buscar</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.header || column.id}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.header || column.id}>
                  {column.accessor
                    ? String(item[column.accessor])
                    : column.cell
                      ? column.cell({ row: { original: item } })
                      : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {pageSize} de {total} resultados
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <div className="text-sm text-gray-400">
            Página {currentPage} de {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">Mostrar</span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-20">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="40">40</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">por página</span>
      </div>
    </div>
  )
}

