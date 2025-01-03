import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface RecordDetailProps<T> {
    id: string;
    fetcher: (id: string) => Promise<T>;
    renderDetails: (data: T) => React.ReactNode;
}

export function RecordDetail<T>({
    id,
    fetcher,
    renderDetails,
}: RecordDetailProps<T>) {
    const { data, isLoading, isError } = useQuery<T>({
        queryKey: ["recordDetail", id],
        queryFn: () => fetcher(id),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto p-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Error al cargar los datos.</AlertDescription>
                </Alert>
            </div>
        );
    }

    return <div className="container mx-auto p-4">{renderDetails(data!)}</div>;
}