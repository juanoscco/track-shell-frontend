import { DetailPropsPage } from "@/modules/dashboard/components/detail-components/record-props/record-props.components"
import { useParams } from "react-router"

export default function DetailIncomePage() {
    const { id = "" } = useParams()

    return (
        <><DetailPropsPage id={id}/> </>
    )
}
