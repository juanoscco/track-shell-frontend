import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axiosInstance from "@/store/interceptor/token-require.interceptor";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area";
const API_URL = import.meta.env.VITE_API_URL;

interface Bag {
    sph: { id: number; value: string };
    cyl: { id: number; value: string };
    quantity: number;
    unitPrice: number;
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
    onValueChange: (values: Array<{ sphId: number; cylId: number; quantity: number; unitPrice: number }>) => void;
    category: string;
}

export function PrescriptionSalesGrid({ onValueChange, category }: TabbedLensTableProps) {

    const [activeTab, setActiveTab] = useState("0.25 - 2");
    const [tableData, setTableData] = useState<{ [key: string]: { id: number; value: string; quantity: number, unitPrice: number } }>({});
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [cylRanges, setCylRanges] = useState<{ name: string; range: Cyl[] }[]>([]);
    const [sphRange, setSphRange] = useState<SPH[]>([]);
    const [isPositive, setIsPositive] = useState(false);
    const [newTableData, setNewTableData] = useState<{
        [key: string]: {
            unitPrice: number;
            sph: { id: number; name: string };
            cyl: { id: number; name: string };
            quantity: number;
        };
    }>({});

    const handleCellChange = (
        sphId: number,
        cylId: number,
        value: string,
        sphName: string,
        cylName: string,
        unitPrice: number // Aquí usamos solo `unitPrice`
    ) => {
        const parsedValue = parseInt(value, 10) || 0;

        setNewTableData((prev) => ({
            ...prev,
            [`${sphId}-${cylId}`]: {
                sph: { id: sphId, name: sphName },
                cyl: { id: cylId, name: cylName },
                quantity: parsedValue,
                unitPrice, // Asegúrate de usar solo `unitPrice` aquí
            },
        }));
    };
    useEffect(() => {
        const values = Object.entries(newTableData).reduce(
            (acc, [key, value]) => {
                if (value && value.quantity > 0) {
                    const [sphId, cylId] = key.split("-").map(Number);
                    acc.push({
                        sphId,
                        cylId,
                        quantity: value.quantity,
                        unitPrice: value.unitPrice, // Agregamos unitPrice
                    });
                }
                return acc;
            },
            [] as Array<{ sphId: number; cylId: number; quantity: number; unitPrice: number }>
        );

        onValueChange(values); // Notifica cambios al componente padre
    }, [newTableData, onValueChange]);

    const [unitPrices, setUnitPrices] = useState<{ [key: string]: number }>({}); // Estado para precios individuales

    // Manejo de cambios en precios individuales
    const handleUnitPriceChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value; // Obtén el valor como cadena
        const newPrice = parseFloat(value); // Intenta convertirlo a número decimal

        if (!isNaN(newPrice) && newPrice >= 0) {
            setNewTableData((prev) => {
                const [sphId, cylId] = key.split("-").map(Number);
                return {
                    ...prev,
                    [`${sphId}-${cylId}`]: {
                        ...prev[`${sphId}-${cylId}`],
                        unitPrice: newPrice, // Actualiza `unitPrice` si es válido
                    },
                };
            });
        } else if (value === "") {
            // Si el campo está vacío, reseteamos el valor a 0 o lo que prefieras
            setNewTableData((prev) => {
                const [sphId, cylId] = key.split("-").map(Number);
                return {
                    ...prev,
                    [`${sphId}-${cylId}`]: {
                        ...prev[`${sphId}-${cylId}`],
                        unitPrice: 0, // Establece a 0 (puedes cambiar esto si es necesario)
                    },
                };
            });
        }
    };


    useEffect(() => {
        const fetchBags = async () => {
            try {
                const data = await getBags(category); // Llama a la API para obtener los datos de las bolsas

                const initialData: { [key: string]: { id: number; value: string; quantity: number; unitPrice: number } } = {};

                // Aquí agregamos el precio por unidad a cada entrada
                data.consolidatedBags.forEach((bag: Bag) => {
                    const key = `${bag.sph.id}-${bag.cyl.id}`;
                    initialData[key] = {
                        id: bag.sph.id,
                        value: bag.sph.value,
                        quantity: bag.quantity,
                        unitPrice: bag.unitPrice,
                    };
                });

                setTableData(initialData);
                setTotalQuantity(data.totalQuantity);
            } catch (error) {
                console.error("Error fetching data:", error); // Manejo de errores
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

    // 
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
                                            onChange={(e) => handleCellChange(sph.id, cyl.id, e.target.value, sph.value, cyl.value, unitPrices[`${sph.id}-${cyl.id}`] || 0)}
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

    const [bonifications, setBonifications] = useState<{ [key: string]: boolean }>({});

    // console.log(newTableData);
    return (
        <div className="w-full bg-white rounded-lg overflow-hidden">
            <div className="font-semibold text-lg">Cantidad Disponible: {totalQuantity}</div>
            
            <div className="pb-3">
           
                <ScrollArea className="flex-col h-[200px] md:h-[300px]">
                    {/* Render entries from newTableData */}
                    {Object.entries(newTableData).map(([key, value]) => {
                        const totalPrice = value.quantity * (unitPrices[key] || value.unitPrice || 0); // Obtiene el precio por unidad individual para cada objeto

                        const handleBonificationChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
                            const isChecked = e.target.checked;
                            setBonifications((prev) => ({
                                ...prev,
                                [key]: isChecked, // Actualiza solo el estado del objeto específico
                            }));

                            // Si el checkbox es marcado, restablece el precio a 0
                            if (isChecked) {
                                setUnitPrices((prev) => ({
                                    ...prev,
                                    [key]: 0, // Establece el precio a 0 para este objeto
                                }));
                            }
                        };


                        return (
                            // <div key={key} className="m-2 p-4 border rounded-lg shadow-md bg-gray-100">
                            //     <div>
                            //         <strong>Esfera:</strong> {value.sph.name}
                            //     </div>
                            //     <div>
                            //         <strong>Cilindro:</strong> {value.cyl.name}
                            //     </div>
                            //     <div>
                            //         <strong>Cantidad:</strong> {value.quantity}
                            //     </div>

                            //     {/* Checkbox para activar bonificación */}
                            //     <div className="mt-2">
                            //         <label>
                            //             <input
                            //                 type="checkbox"
                            //                 checked={bonifications[key] || false} // Usa el valor del estado o false si no está definido
                            //                 onChange={(e) => handleBonificationChange(key, e)}

                            //                 className="mr-2"
                            //             />
                            //             Bonificación
                            //         </label>
                            //     </div>


                            //     {/* Input para el precio por unidad */}
                            //     <div className="mt-4">
                            //         <input
                            //             type="number"
                            //             step="0.01" // Permitir decimales
                            //             value={value.unitPrice || ""} // Mostrar el valor actual o cadena vacía
                            //             onChange={(e) => handleUnitPriceChange(key, e)} // Llama a la función en cambios
                            //             className="p-2 border rounded"
                            //             placeholder="Precio por unidad"
                            //             disabled={bonifications[key] || false} // Deshabilitar si tiene bonificación activa
                            //         />
                            //     </div>

                            //     {/* Mostrar el precio total */}
                            //     <div>
                            //         <strong>Total Precio:</strong>
                            //         {bonifications[key] ? "Bonificado" : `$${totalPrice.toFixed(2)}`}
                            //     </div>
                            // </div>

                            <Card key={key} className="m-1 shadow-none flex flex-col p-0">
                                <CardHeader className="px-3 pb-0 pt-2">
                                    <CardTitle className="text-lg">Producto </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="sphere">Esfera</Label>
                                            <div id="sphere" className="font-medium">{value.sph.name}</div>
                                        </div>
                                        <div>
                                            <Label htmlFor="cylinder">Cilindro</Label>
                                            <div id="cylinder" className="font-medium">{value.cyl.name}</div>
                                        </div>
                                        <div>
                                            <Label htmlFor="quantity">Cantidad</Label>
                                            <div id="quantity" className="font-medium">{value.quantity}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={bonifications[key] || false} // Usa el valor del estado o false si no está definido
                                            onChange={(e) => handleBonificationChange(key, e)}

                                            className="mr-2"
                                        />
                                        <Label htmlFor={`bonification-${key}`}>Bonificación</Label>
                                    </div>

                                    <div>
                                        <Label htmlFor={`unitPrice-${key}`}>Precio por unidad</Label>
                                        <Input
                                            id={`unitPrice-${key}`}
                                            type="number"
                                            step="0.01"
                                            value={value.unitPrice || ""}
                                            onChange={(e) => handleUnitPriceChange(key, e)}
                                            placeholder="Precio por unidad"
                                            disabled={bonifications[key] || false}
                                        />
                                    </div>

                                    <div>
                                        <Label>Total Precio</Label>
                                        <div className="font-medium">
                                            {bonifications[key] ? "Bonificado" : `$${totalPrice.toFixed(2)}`}
                                        </div>
                                    </div>
                                </CardContent>

                            </Card>


                        );
                    })}
                </ScrollArea>


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
