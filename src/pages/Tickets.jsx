import data from "../constants/data.json"
import { DataTable } from "../components/ui/table/DataTable"

export default function Tickets() {
  return <DataTable data={data} />
}
