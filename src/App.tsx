import TanStackTable from "./components/TanstackTable";

type PaginationInfo = {
  total_records: number;
  total_pages: number;
  page_size: number;
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
};

function paginate<T>(data: T[], page: number, pageSize: number) {
  const total_records = data.length;
  const total_pages = Math.ceil(total_records / pageSize);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const records = data.slice(start, end);

  const pagination_info: PaginationInfo = {
    total_records,
    total_pages,
    page_size: pageSize,
    current_page: page,
    next_page: page < total_pages ? page + 1 : null,
    prev_page: page > 1 ? page - 1 : null,
  };

  return { pagination_info, records };
}

// ---------------- DATA ---------------- //
const userData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  temp_id: `SVC-APRT-${33 + i}-${1000 + i}`,
  organisation_name: i % 2 === 0 ? "OpenAI Pvt Ltd" : "TechCorp Solutions",
  user: {
    first_name: `User${i + 1}`,
    last_name: i % 2 === 0 ? "Singh" : "Reddy",
  },
  advocate_cases:
    i % 3 === 0
      ? [
          {
            advocate: {
              first_name: "Adv",
              last_name: `#${i + 1}`,
              profile_pic: null,
            },
          },
        ]
      : [],
  service: {
    issue: i % 2 === 0 ? "Contract Dispute" : "Legal Notice",
  },
  service_type: i % 2 === 0 ? "Civil" : "Criminal",
  stage: i % 4 === 0 ? "draft" : i % 4 === 1 ? "review" : "completed",
  next_hearing_date: `2025-10-${(i % 28) + 1}`,
}));

const pageSize = 15;
const page = 1; // change dynamically as needed

const { pagination_info, records } = paginate(userData, page, pageSize);

console.log("Pagination Info:", pagination_info);
console.log("Paginated Records:", records);

// ---------------- COLUMNS ---------------- //
const columns = [
  {
    accessorFn: (row: any) => row.temp_id,
    id: "case_reference",
    header: () => <span className="text-sm">Service ID</span>,
    footer: (props: any) => props.column.id,
    size: 120,
    cell: (info: any) => (
      <span className="text-xs">{info.getValue() || "--"}</span>
    ),
  },
  {
    accessorFn: (row: any) => row.organisation_name,
    id: "organization_name",
    header: () => <span className="text-sm">Organization</span>,
    footer: (props: any) => props.column.id,
    size: 200,
    cell: (info: any) => (
      <span className="text-xs flex gap-2 items-center">
        {info.getValue() || "--"}
      </span>
    ),
  },
  {
    accessorFn: (row: any) => {
      const firstName = row.user?.first_name || "";
      const lastName = row.user?.last_name || "";
      return { fullname: `${firstName} ${lastName}`, avatar: null };
    },
    id: "customer_name",
    header: () => <span className="text-sm">Point of Contact</span>,
    footer: (props: any) => props.column.id,
    size: 180,
    cell: (info: any) => {
      const { fullname } = info.getValue() || { fullname: "--" };
      return (
        <span className="flex gap-2 items-center">
          <span className="self-center text-xs">{fullname}</span>
        </span>
      );
    },
  },
  {
    accessorFn: (row: any) => row.advocate_cases || [],
    id: "advocates",
    header: () => <span className="text-sm">Advocate</span>,
    footer: (props: any) => props.column.id,
    size: 130,
    cell: (info: any) => {
      const advocateCases = info.getValue();
      if (!advocateCases || advocateCases.length === 0) {
        return <span className="text-xs">Not Assigned</span>;
      }
      const advocate = advocateCases[0].advocate;
      const advocateName = advocate
        ? `${advocate.first_name} ${advocate.last_name}`
        : "Unknown Advocate";

      return (
        <div className="flex items-center space-x-2">
          <span className="text-xs truncate">{advocateName}</span>
        </div>
      );
    },
  },
  {
    accessorFn: (row: any) => row.service?.issue || row.service_type || "",
    id: "service_type",
    header: () => <span className="text-sm">Issue</span>,
    footer: (props: any) => props.column.id,
    size: 130,
    cell: (info: any) => (
      <span className="text-xs">{info.getValue() || "--"}</span>
    ),
  },
  {
    accessorFn: (row: any) => row.stage || "",
    id: "stage",
    header: () => <span className="text-sm">Stage</span>,
    footer: (props: any) => props.column.id,
    size: 100,

    cell: (info: any) => (
      <span className="text-xs uppercase">{info.getValue() || "--"}</span>
    ),
  },
  {
    accessorFn: (row: any) => row.next_hearing_date || "",
    id: "next_hearing",
    header: () => <span className="text-sm">Next Hearing</span>,
    footer: (props: any) => props.column.id,
    size: 110,

    cell: (info: any) => {
      const value = info.getValue();
      return <span className="text-xs">{value ?? "--"}</span>;
    },
  },
  {
    accessorFn: (row: any) =>
      row.location || (row.id % 2 === 0 ? "Hyderabad" : "Bangalore"),
    id: "location",
    header: () => <span className="text-sm">Location</span>,
    size: 130,

    cell: (info: any) => <span className="text-xs">{info.getValue()}</span>,
  },
  {
    accessorFn: (row: any) =>
      row.department || (row.id % 2 === 0 ? "Engineering" : "HR"),
    id: "department",
    header: () => <span className="text-sm">Department</span>,
    footer: (props: any) => props.column.id,
    size: 130,

    cell: (info: any) => <span className="text-xs">{info.getValue()}</span>,
  },
  {
    accessorFn: (row: any) => row,
    id: "actions",
    header: () => <span className="text-sm">Actions</span>,
    footer: (props: any) => props.column.id,
    size: 180,
    cell: () => (
      <div className="flex space-x-3 items-center text-xs cursor-pointer">
        <span title="View Service">View</span>
        <span>Manage</span>
      </div>
    ),
  },
];

const App = () => {
  return (
    <div className="p-0">
      <h2 className="mb-4 font-bold text-xl">TanStack Table Example</h2>
      <div className="overflow-auto w-full">
        <TanStackTable
          columns={columns}
          data={userData}
          heightClass="h-[calc(100vh-300px)]"
          wrapperClassName="rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden"
          tableClassName="min-w-full border-collapse text-sm"
          headerRowClassName="bg-gray-100 border-b border-gray-200"
          headerCellClassName="px-4 py-2 text-left font-semibold text-gray-700 text-sm"
          bodyClassName="divide-y divide-gray-200"
          rowClassName="hover:bg-gray-50 transition-colors"
          cellClassName="px-4 py-2 text-gray-600 text-xs"
          paginationDetails={pagination_info}
          removeSortingForColumnIds={[
            "case_reference",
            "actions",
            "location",
            "service_type",
            "next_hearing",
            "stage",
            "advocates",
            "customer_name",
            "organization_name",
            "department",
          ]}
        />
      </div>
    </div>
  );
};

export default App;
