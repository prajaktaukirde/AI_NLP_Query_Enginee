import type { ChartConfig } from "@/components/ui/chart"

// --- Schema Data ---
export interface SchemaInfo {
  tables: number;
  columns: number;
  relationships: number;
}

export interface DiscoveredSchema {
  info: SchemaInfo;
  tables: {
    name: string;
    columns: { name: string; type: string; isPrimaryKey?: boolean }[];
  }[];
  relationships: {
    fromTable: string;
    fromColumn: string;
    toTable: string;
    toColumn: string;
  }[];
}

export const discoveredSchema: DiscoveredSchema = {
  info: {
    tables: 3,
    columns: 15,
    relationships: 2,
  },
  tables: [
    {
      name: "employees",
      columns: [
        { name: "emp_id", type: "integer", isPrimaryKey: true },
        { name: "full_name", type: "varchar" },
        { name: "dept_id", type: "integer" },
        { name: "position", type: "varchar" },
        { name: "annual_salary", type: "numeric" },
        { name: "join_date", type: "date" },
      ],
    },
    {
      name: "departments",
      columns: [
        { name: "dept_id", type: "integer", isPrimaryKey: true },
        { name: "dept_name", type: "varchar" },
        { name: "manager_id", type: "integer" },
      ],
    },
    {
        name: "documents",
        columns: [
          { name: "doc_id", type: "uuid", isPrimaryKey: true },
          { name: "emp_id", type: "integer" },
          { name: "type", type: "varchar" },
          { name: "content", type: "text" },
          { name: "uploaded_at", type: "timestamp" },
        ],
      },
  ],
  relationships: [
    { fromTable: "employees", fromColumn: "dept_id", toTable: "departments", toColumn: "dept_id" },
    { fromTable: "documents", fromColumn: "emp_id", toTable: "employees", toColumn: "emp_id" },
  ],
};


// --- Query Results Data ---
export interface QueryResult {
  type: 'SQL' | 'Documents' | 'Hybrid';
  sqlData?: Record<string, any>[];
  docData?: Record<string, any>[];
}

export const sqlResults: QueryResult = {
  type: 'SQL',
  sqlData: [
    { emp_id: 101, full_name: 'Alice Johnson', position: 'Software Engineer', annual_salary: 120000 },
    { emp_id: 105, full_name: 'Bob Williams', position: 'Senior Engineer', annual_salary: 150000 },
    { emp_id: 202, full_name: 'Charlie Brown', position: 'Product Manager', annual_salary: 140000 },
    { emp_id: 108, full_name: 'David Lee', position: 'DevOps Engineer', annual_salary: 135000 },
    { emp_id: 301, full_name: 'Eve Davis', position: 'Data Scientist', annual_salary: 160000 },
  ],
};

export const docResults: QueryResult = {
    type: 'Documents',
    docData: [
      { source: "John_Doe_Review_2023.pdf", content: "John consistently exceeds expectations... shows strong leadership potential. Needs to improve on <mark>documentation</mark> practices." },
      { source: "Engineering_Handbook.docx", content: "All engineers are required to complete a quarterly performance review. These <mark>reviews</mark> are crucial for career development." },
      { source: "Alice_Johnson_Resume.pdf", content: "Led a team of 5 engineers in the development of a new microservice. Skilled in <mark>Python</mark>, Java, and React." },
    ]
};

export const hybridResults: QueryResult = {
  type: 'Hybrid',
  sqlData: [
    { emp_id: 101, full_name: 'Alice Johnson', dept_name: 'Engineering', position: 'Software Engineer' },
    { emp_id: 105, full_name: 'Bob Williams', dept_name: 'Engineering', position: 'Senior Engineer' },
    { emp_id: 301, full_name: 'Eve Davis', dept_name: 'Data Science', position: 'Data Scientist' },
  ],
  docData: [
    { source: "Alice_Johnson_Resume.pdf", content: "...proficient in several programming languages including <mark>Python</mark>, Go, and JavaScript." },
    { source: "Tech_Talk_Signups.csv", content: "Eve Davis, Introduction to <mark>Python</mark> for Data Analysis" },
  ]
};


// --- Chart Data ---
export const chartData = [
    { time: "12:00", responseTime: 850 },
    { time: "12:10", responseTime: 1100 },
    { time: "12:20", responseTime: 920 },
    { time: "12:30", responseTime: 1300 },
    { time: "12:40", responseTime: 780 },
    { time: "12:50", responseTime: 1050 },
    { time: "13:00", responseTime: 950 },
];
  
export const chartConfig = {
    responseTime: {
      label: "Response Time (ms)",
      color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;
