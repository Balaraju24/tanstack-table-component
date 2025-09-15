import TanStackTable from "./components/TanstackTable";

const columns = [
  { id: "name", header: "Name", accessorKey: "name" },
  { id: "age", header: "Age", accessorKey: "age" },
];
const data = [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 },
];

export default function App() {
  return <TanStackTable columns={columns} data={data} />;
}
