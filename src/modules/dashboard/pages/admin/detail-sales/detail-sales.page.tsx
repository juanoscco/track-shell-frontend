import { useParams } from "react-router"
import { DetailPropsPage } from "@/modules/dashboard/components/detail-components/record-props/record-props.components"


export default function DetailSalesPage() {

    const { id = "" } = useParams()

    return (
        <><DetailPropsPage id={id} /> </>
    )
}
