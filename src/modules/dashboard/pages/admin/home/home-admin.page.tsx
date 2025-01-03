import { TableDataHome } from "@/modules/dashboard/components/home-data";

export default function HomePage(){
  return (
    <section>
      <h1 className="px-2 font-bold text-2xl pt-4">Inventario</h1>
      <TableDataHome/>
    </section>
  )
}