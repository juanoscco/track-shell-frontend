import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axiosInstance from "@/store/interceptor/token-require.interceptor";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API_URL = import.meta.env.VITE_API_URL;

interface Bag {
  sph: { id: number; value: string };
  cyl: { id: number; value: string };
  quantity: number;
}

interface BagsResponse {
  categoryId: string;
  totalQuantity: number;
  consolidatedBags: Bag[];
}

const getBags = async (categoryId: string): Promise<BagsResponse> => {
  const response = await axiosInstance.get(`${API_URL}/api/bags`, {
    params: { categoryId },
  });
  return response.data;
};

interface Cyl {
  id: number;
  value: string;
}

interface SPH {
  id: number;
  value: string;
}

const fetchCylData = async (): Promise<Cyl[]> => {
  const response = await axiosInstance.get(`${API_URL}/api/cyl`);
  return response.data;
};

const fetchSPHData = async (type: string): Promise<SPH[]> => {
  try {
    const response = await axiosInstance.get(`${API_URL}/api/sph`, {
      params: { type },
    });
    if (!response.data || response.data.length === 0) {
      throw new Error(`No data found for type: ${type}`);
    }

    const mappedData = response.data.map((sph: SPH) => {
      return {
        ...sph,
        value: sph.value,  // Mantén el valor como string
      };
    });


    return mappedData;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};


interface Category {
  id: number;
  name: string;
}

interface CategoryResponse {
  categories: Category[];
  total: number;
  totalPages: number;
  currentPage: number;
  currentPageSize: number;
}

export function TableDataHome() {
  const [activeTab, setActiveTab] = useState("0.25 - 2");
  const [isPositive, setIsPositive] = useState(false);
  const [tableData, setTableData] = useState<{ [key: string]: number }>({});
  const [categoryId, setCategoryId] = useState("1");
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [cylRanges, setCylRanges] = useState<{ name: string; range: string[] }[]>([]);
  const [sphRange, setSphRange] = useState<string[]>([]);

  // 
  const { data, error, isLoading } = useQuery<CategoryResponse, Error>({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });

  const { categories = [] } = data || {};
  // 

  useEffect(() => {
    const fetchBags = async () => {
      try {
        const data = await getBags(categoryId);

        const initialData: { [key: string]: number } = {};

        data.consolidatedBags.forEach((bag) => {
          const key = `${String(bag.sph.value)}-${String(bag.cyl.value)}`;
          initialData[key] = bag.quantity;
        });

        setTableData(initialData);
        setTotalQuantity(data.totalQuantity);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBags();
  }, [categoryId]);

  useEffect(() => {
    const fetchAndSetCylRanges = async () => {
      try {
        const data = await fetchCylData();

        const groupedRanges = [
          {
            name: "0.25 - 2",
            range: data.filter((cyl) => parseFloat(cyl.value) <= 2.0)
              .map((cyl) => parseFloat(cyl.value).toFixed(2)),  // Formatea a 2 decimales
          },
          {
            name: "2.25 - 4",
            range: data.filter((cyl) => parseFloat(cyl.value) > 2.0 && parseFloat(cyl.value) <= 4.0)
              .map((cyl) => parseFloat(cyl.value).toFixed(2)),  // Formatea a 2 decimales
          },
          {
            name: "4.25 - 6",
            range: data.filter((cyl) => parseFloat(cyl.value) > 4.0)
              .map((cyl) => parseFloat(cyl.value).toFixed(2)),  // Formatea a 2 decimales
          },
        ];

        setCylRanges(groupedRanges);
      } catch {
        // No need for error handling here if no action needed
      }
    };

    fetchAndSetCylRanges();
  }, []);

  useEffect(() => {
    const fetchSphRange = async () => {
      try {
        const type = isPositive ? "positive" : "negative";

        const data = await fetchSPHData(type);

        // Aseguramos que cada valor de sph sea un string
        const range = data.map((sph) => {
          const value = String(sph.value); // Aseguramos que el valor es un string
          return value;
        });

        setSphRange(range); // Actualizamos el estado con un array de strings
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSphRange();
  }, [isPositive]);

  const getCellColor = (cylValue: string) => {
    const cylNum = parseFloat(cylValue);
    if (cylNum <= 2.0) return "bg-yellow-100";
    if (cylNum <= 4.0) return "bg-blue-100";
    return "bg-white";
  };

  const renderTable = (cylRange: string[]) => (
    <div className="overflow-x-auto">
      <table className="w-full border border-collapse">
        <thead>
          <tr className="">
            <th className="sticky left-0  border p-2 font-bold text-sm bg-[#0080DAEB] text-white w-20">
              <label htmlFor="sign-select">SPH</label>
              <select
                id="sign-select"
                onChange={(e) => setIsPositive(e.target.value === "positive")}
                value={isPositive ? "positive" : "negative"}
                className="mt-1  bg-transparent rounded text-sm "
              >
                <option value="negative">(-)</option>
                <option value="positive">(+)</option>
              </select>
            </th>
            <th colSpan={cylRange.length} className="border p-2 text-sm bg-[#0080DAEB] text-white">
              CYL
            </th>
          </tr>
          <tr className="bg-gray-100">
            <th className="sticky left-0 bg-gray-100 border border-r p-2"></th>
            {cylRange.map((cyl) => (
              <th key={cyl} className={`border p-2 text-sm text-gray-600 w-16 ${getCellColor(cyl)}`}>
                {cyl}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sphRange.map((sph) => (
            <tr key={sph} className="hover:bg-gray-50">
              <td className="sticky left-0 bg-gray-100 border w-16 p-2 font-bold text-sm text-gray-700">
                {sph}
              </td>
              {cylRange.map((cyl) => (
                <td key={`${sph}-${cyl}`} className={`border p-0 text-center text-sm border-gray-300 ${getCellColor(cyl)}`}>
                  <input
                    type="number"
                    value={tableData[`${sph}-${cyl}`] || 0}
                    className="w-full h-full text-center bg-transparent"
                    readOnly
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full bg-white rounded-lg overflow-hidden p-2">
      <div className="p-4 flex items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="category-select" className="block font-bold text-sm">
            Materiales:
          </label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger id="category-select" className="w-[250px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>Cargando...</SelectItem>
              ) : error ? (
                <SelectItem value="error" disabled>Error al cargar categorías</SelectItem>
              ) : (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 font-bold text-lg">Total: {totalQuantity}</div>
      </div>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          {cylRanges.map((tab) => (
            <TabsTrigger
              key={tab.name}
              value={tab.name}
              className="flex-1 font-bold  rounded-sm"
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {cylRanges.map((tab) => (
          <TabsContent
            key={tab.name}
            value={tab.name}
            
          >
            {renderTable(tab.range)}  {/* Aquí tab.range es un array de strings */}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

const getCategories = async (page: number = 1, limit: number = 100, search: string = ''): Promise<CategoryResponse> => {
  const response = await axiosInstance.get(`${API_URL}/api/categories`, {
    params: {
      page, limit, search
    }
  });
  return response.data;
};