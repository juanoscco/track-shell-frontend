import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axiosInstance from "@/store/interceptor/token-require.interceptor";

const API_URL = import.meta.env.VITE_API_URL;

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

        // Procesamos los datos manteniendo el tipo string en value
        const mappedData = response.data.map((sph: SPH) => {

            return {
                ...sph,
                value: sph.value,  // Mantén el valor como string
            };
        });

        // Mostramos los datos mapeados antes de devolverlos

        return mappedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

interface TabbedLensTableProps {
    onValueChange: (values: Array<{ sphId: number; cylId: number; quantity: number }>) => void;
}

export function PrescriptionGrid({ onValueChange }: TabbedLensTableProps) {
    const [cylRanges, setCylRanges] = useState<{ name: string; range: { id: number; value: string }[] }[]>([]);
    const [sphRange, setSphRange] = useState<{ id: number; value: string }[]>([]);
    const [activeTab, setActiveTab] = useState("0.25 - 2")
    const [isPositive, setIsPositive] = useState(false)
    const [tableData, setTableData] = useState<{ [key: string]: number }>({})

    useEffect(() => {
        const initialData: { [key: string]: number } = {};

        sphRange.forEach((sph) => {
            cylRanges.forEach((cylRange) => {
                cylRange.range.forEach((cyl) => {
                    initialData[`${sph.id}-${cyl.id}`] = 0;
                });
            });
        });

        setTableData(initialData);
    }, [sphRange, cylRanges]);

    useEffect(() => {
        const values = Object.entries(tableData).reduce((acc, [key, value]) => {
            if (value && value > 0) {
                const [sphId, cylId] = key.split("-").map(Number);
                acc.push({ sphId, cylId, quantity: value });
            }
            return acc;
        }, [] as Array<{ sphId: number; cylId: number; quantity: number }>);
        onValueChange(values);
    }, [tableData, onValueChange]);

    useEffect(() => {
        const fetchAndSetCylRanges = async () => {
            try {
                const data = await fetchCylData();
                const groupedRanges = [
                    {
                        name: "0.25 - 2",
                        range: data.filter((cyl) => parseFloat(cyl.value) <= 2.0)
                            .map((cyl) => ({ id: cyl.id, value: parseFloat(cyl.value).toFixed(2) })),
                    },
                    {
                        name: "2.25 - 4",
                        range: data.filter((cyl) => parseFloat(cyl.value) > 2.0 && parseFloat(cyl.value) <= 4.0)
                            .map((cyl) => ({ id: cyl.id, value: parseFloat(cyl.value).toFixed(2) })),
                    },
                    {
                        name: "4.25 - 6",
                        range: data.filter((cyl) => parseFloat(cyl.value) > 4.0)
                            .map((cyl) => ({ id: cyl.id, value: parseFloat(cyl.value).toFixed(2) })),
                    },
                ];
                setCylRanges(groupedRanges);
            } catch (error) {
                console.error("Error fetching CYL data:", error);
            }
        };

        fetchAndSetCylRanges();
    }, []);

    useEffect(() => {
        const fetchAndSetSphRange = async () => {
            try {
                // Determinamos el tipo basado en isPositive
                const type = isPositive ? "positive" : "negative";

                // Llamamos a la función con el tipo correspondiente
                const data = await fetchSPHData(type);

                // Mapeamos los datos al formato requerido por el estado
                const range = data.map((sph: { id: number; value: string }) => ({
                    id: sph.id,
                    value: String(sph.value), // Aseguramos que el valor sea un string
                }));

                // Actualizamos el estado con el array de objetos en el formato correcto
                setSphRange(range);
            } catch (error) {
                console.error("Error fetching SPH data:", error);
            }
        };

        fetchAndSetSphRange();
    }, [isPositive]);

    const handleCellChange = (sphId: number, cylId: number, value: string) => {
        setTableData((prev) => ({
            ...prev,
            [`${sphId}-${cylId}`]: parseInt(value, 10) || 0,
        }));
    };

    const getCellColor = (cylValue: string) => {
        const cylNum = parseFloat(cylValue);
        if (cylNum <= 2.0) return "bg-yellow-100";
        if (cylNum <= 4.0) return "bg-blue-100";
        return "bg-white";
    };
    const renderTable = (cylRange: { id: number; value: string }[]) => (
        <div className="overflow-x-auto">
            <table className="w-full border border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="sticky left-0 bg-gray-200 border p-2 font-bold text-sm text-gray-700 w-20">
                            SPH
                            <select 
                            className="bg-transparent outline-none ml-1"
                            onChange={(e) => setIsPositive(e.target.value === "positive")} 
                            value={isPositive ? "positive" : "negative"}
                            >
                                <option value="negative">(-)</option>
                                <option value="positive">(+)</option>
                            </select>
                        </th>
                        <th className="border p-2 text-sm text-gray-700" colSpan={8} >CYL</th>
                    </tr>
                    <tr>
                        <th className="sticky left-0 bg-gray-100 border border-r p-2"></th>
                        {cylRange.map((cyl) => (
                            <th key={cyl.id} className={`border p-2 text-sm text-center  text-gray-600 w-16 ${getCellColor(cyl.value)}`}>
                                {cyl.value}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sphRange.map((sph) => (
                        <tr key={sph.id}>
                            <td className="sticky left-0 bg-gray-100 border p-2 text-sm text-center">
                                {sph.value}
                            </td>
                            {cylRange.map((cyl) => (
                                <td key={`${sph.id}-${cyl.id}`} 
                                className={`border p-0 text-center text-sm border-gray-300 ${getCellColor(cyl.value)}`}
                                >
                                    <input
                                        type="text"
                                        value={tableData[`${sph.id}-${cyl.id}`] || 0}
                                        onChange={(e) => handleCellChange(sph.id, cyl.id, e.target.value)}
                                        className="w-full h-full text-center bg-transparent"
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
        <div className="w-full bg-white rounded-lg overflow-hidden">
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
