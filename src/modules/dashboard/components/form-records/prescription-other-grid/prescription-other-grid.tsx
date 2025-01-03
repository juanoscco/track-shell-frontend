import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axiosInstance from "@/store/interceptor/token-require.interceptor";

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

interface TabbedLensTableProps {
  onValueChange: (values: Array<{ sphId: number; cylId: number; quantity: number }>) => void;
  category: string;
}

export function PrescriptionOtherGrid({ onValueChange, category }: TabbedLensTableProps) {

  const [activeTab, setActiveTab] = useState("0.25 - 2");
  const [tableData, setTableData] = useState<{ [key: string]: { id: number; value: string; quantity: number } }>({});
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [cylRanges, setCylRanges] = useState<{ name: string; range: Cyl[] }[]>([]);
  const [sphRange, setSphRange] = useState<SPH[]>([]);
  const [isPositive, setIsPositive] = useState(false);
  const [newTableData, setNewTableData] = useState<{ [key: string]: number }>({});

  const handleCellChange = (sphId: number, cylId: number, value: string) => {
    setNewTableData((prev) => ({
      ...prev,
      [`${sphId}-${cylId}`]: parseInt(value, 10) || 0, // Asegura que sea un número válido o 0
    }));
  };
  useEffect(() => {
    const values = Object.entries(newTableData).reduce((acc, [key, value]) => {
      if (value && value > 0) {
        const [sphId, cylId] = key.split("-").map(Number);
        acc.push({ sphId, cylId, quantity: value });
      }
      return acc;
    }, [] as Array<{ sphId: number; cylId: number; quantity: number }>);

    onValueChange(values); // Notifica cambios al padre
  }, [newTableData, onValueChange]);

  useEffect(() => {
    const fetchBags = async () => {
      try {
        const data = await getBags(category);

        const initialData: { [key: string]: { id: number; value: string; quantity: number } } = {};

        data.consolidatedBags.forEach((bag: Bag) => {
          const key = `${bag.sph.id}-${bag.cyl.id}`;
          initialData[key] = {
            id: bag.sph.id,
            value: bag.sph.value,
            quantity: bag.quantity,
          };
        });

        setTableData(initialData);
        setTotalQuantity(data.totalQuantity);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBags();
  }, [category]);

  useEffect(() => {
    const fetchAndSetCylRanges = async () => {
      try {
        const data = await fetchCylData();

        const groupedRanges = [
          {
            name: "0.25 - 2",
            range: data.filter((cyl) => parseFloat(cyl.value) <= 2.0),
          },
          {
            name: "2.25 - 4",
            range: data.filter((cyl) => parseFloat(cyl.value) > 2.0 && parseFloat(cyl.value) <= 4.0),
          },
          {
            name: "4.25 - 6",
            range: data.filter((cyl) => parseFloat(cyl.value) > 4.0),
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

        setSphRange(data);
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


  const renderTable = (cylRange: Cyl[]) => (
    <div className="overflow-x-auto">
      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="sticky left-0 bg-gray-200 border p-2 font-bold text-sm text-gray-700 w-20">
              <label htmlFor="sign-select">SPH</label>
              <select
                id="sign-select"
                onChange={(e) => setIsPositive(e.target.value === "positive")}
                value={isPositive ? "positive" : "negative"}
                className="outline-none border bg-transparent rounded text-sm p-1"
              >
                <option value="negative">(-)</option>
                <option value="positive">(+)</option>
              </select>
            </th>
            <th colSpan={cylRange.length} className="border p-2 text-sm text-gray-700">
              CYL
            </th>
          </tr>
          <tr className="bg-gray-100">
            <th className="sticky left-0 bg-gray-100 border border-r p-2"></th>
            {cylRange.map((cyl) => (
              <th
                key={cyl.id}
                className={`border p-2 text-sm text-gray-600 w-16 ${getCellColor(cyl.value)}`}
              >
                {cyl.value}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sphRange.map((sph) => (
            <tr key={sph.id} className="hover:bg-gray-50">
              <td className="sticky left-0 bg-gray-100 border w-16 p-2 font-bold text-sm text-gray-700">
                {sph.value}
              </td>
              {cylRange.map((cyl) => {
                const key = `${sph.id}-${cyl.id}`;
                const bag = tableData[key] || { quantity: 0 };
                return (
                  <td
                    key={key}
                    className={`border p-0 text-center text-sm border-gray-300 ${getCellColor(cyl.value)}`}
                  >
                    <input
                      type="text"
                      // value={newTableData[`${sph.id}-${cyl.id}`]}
                      placeholder={String(bag.quantity)}
                      className="w-full h-full text-center bg-transparent"
                      onChange={(e) => handleCellChange(sph.id, cyl.id, e.target.value)}
                      disabled={bag.quantity === 0}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full bg-white rounded-lg overflow-hidden">
      <div className="pb-3 flex items-center">
        <div className=" font-semibold text-lg">Cantidad Disponible: {totalQuantity}</div>
      </div>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          {cylRanges.map((tab) => (
            <TabsTrigger key={tab.name} value={tab.name} className="flex-1">
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {cylRanges.map((tab) => (
          <TabsContent key={tab.name} value={tab.name}>
            {renderTable(tab.range)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
