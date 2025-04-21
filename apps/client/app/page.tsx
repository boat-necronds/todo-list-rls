import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

export default async function Page() {
  const data = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Sam Wilson", email: "sam@example.com", role: "Editor" },
  ]

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <Table className="w-full border-collapse">
          <TableHeader className="bg-gray-800 text-white">
            <TableRow>
              <TableHead className="px-4 py-2 text-left">ID</TableHead>
              <TableHead className="px-4 py-2 text-left">Name</TableHead>
              <TableHead className="px-4 py-2 text-left">Email</TableHead>
              <TableHead className="px-4 py-2 text-left">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={item.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200 transition-colors`}
              >
                <TableCell className="px-4 py-2 border-b">{item.id}</TableCell>
                <TableCell className="px-4 py-2 border-b">{item.name}</TableCell>
                <TableCell className="px-4 py-2 border-b">{item.email}</TableCell>
                <TableCell className="px-4 py-2 border-b">{item.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
