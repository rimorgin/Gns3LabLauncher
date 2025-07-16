import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBulkUserPost } from "@clnt/lib/mutations/user/bulk-user-create-mutation";
import { Button } from "@clnt/components/ui/button";
import { Input } from "@clnt/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@clnt/components/ui/select";
import { toast } from "sonner";
import {
  UserBulkCreateData,
  userBulkCreateSchema,
} from "@clnt/lib/validators/user-schema";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@clnt/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@clnt/components/ui/form";
import Papa from "papaparse";
import { useQuickDialogStore } from "@clnt/lib/store/quick-create-dialog-store";

export function UserBulkCreateForm() {
  const toggleQuickDialog = useQuickDialogStore(
    (state) => state.toggleQuickDialog,
  );
  const form = useForm<UserBulkCreateData>({
    resolver: zodResolver(userBulkCreateSchema),
  });

  const { fields, append, replace, remove } = useFieldArray({
    control: form.control,
    name: "users",
  });

  const { mutateAsync, status } = useBulkUserPost();

  const onSubmit = async (data: UserBulkCreateData) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    toast.promise(mutateAsync({ users: data.users }), {
      loading: "Creating users...",
      success: () => {
        toggleQuickDialog();
        return "Users created successfully!";
      },
      error: (err) => err.response?.data?.message ?? "Failed",
    });
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        type UserRow = UserBulkCreateData["users"][number];
        const parsedUsers: UserRow[] = (
          results.data as Record<string, string>[]
        ).map((row): UserRow => {
          const role: UserRow["role"] =
            row.role?.toLowerCase() === "instructor" ? "instructor" : "student";

          return {
            name: row.name || "",
            email: row.email || "",
            username: row.username || "",
            password: row.password || "",
            role,
            ...(role === "student"
              ? { student: { classroomIds: [], groupIds: [] } }
              : { instructor: { expertise: [], classroomIds: [] } }),
          };
        });

        console.log("Parsed CSV:", parsedUsers);
        replace(parsedUsers);
        toast.success(`${parsedUsers.length} users loaded from CSV`);
      },
      error: (err) => {
        console.error(err);
        toast.error("Failed to parse CSV");
      },
    });
  };

  const columns: ColumnDef<UserBulkCreateData["users"][number]>[] = [
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`users.${row.index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      id: "email",
      header: "Email",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`users.${row.index}.email`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      id: "username",
      header: "Username",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`users.${row.index}.username`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      id: "password",
      header: "Password",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`users.${row.index}.password`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="••••••••" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      id: "role",
      header: "Role",
      cell: ({ row }) => (
        <FormField
          control={form.control}
          name={`users.${row.index}.role`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button type="button" onClick={() => remove(row.index)}>
          Remove
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: fields,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("Validation errors:", errors);
          toast.error("Form has validation errors");
        })}
        className="overflow-scroll "
      >
        <div className="my-4">
          <Input type="file" accept=".csv" onChange={handleCsvUpload} />
          <p className="text-xs text-muted-foreground mt-1">
            Upload a CSV with columns: name, email, username, password, role
          </p>
        </div>
        <div className="w-full overflow-x-auto rounded-lg">
          <Table className="w-full border">
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="border px-4 py-3 text-left text-xs font-medium bg-muted uppercase tracking-wider"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-2 border">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 space-x-2">
          <Button
            type="button"
            onClick={() =>
              append({
                name: "",
                email: "",
                username: "",
                password: "",
                role: "student",
                student: { classroomIds: [], groupIds: [] },
              })
            }
          >
            Add Student
          </Button>
          <Button
            type="button"
            onClick={() =>
              append({
                name: "",
                email: "",
                username: "",
                password: "",
                role: "instructor",
                instructor: { expertise: [], classroomIds: [] },
              })
            }
          >
            Add Instructor
          </Button>

          <Button type="submit" disabled={status === "pending"}>
            {status === "pending" ? "Creating…" : "Create Users"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
