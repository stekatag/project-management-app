import { Head, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Alert, AlertTitle } from "@/Components/ui/alert";
import { AlertCircle } from "lucide-react";
import { DataTable } from "@/Components/data-table-components/data-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import InputError from "@/Components/InputError";
import {
  PROJECT_STATUS_CLASS_MAP,
  PROJECT_STATUS_TEXT_MAP,
} from "@/utils/constants";
import { formatDate } from "@/utils/helpers";
import { PageProps } from "@/types";
import { Project } from "@/types/project";
import { PaginatedTask, Task } from "@/types/task";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";
import { FilterableColumn } from "@/types/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

type Props = {
  project: Project;
  tasks: PaginatedTask;
  success: string | null;
  queryParams: { [key: string]: any };
};

const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task Name" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <span
        className={`rounded px-2 py-1 text-white ${PROJECT_STATUS_CLASS_MAP[row.original.status]}`}
      >
        {PROJECT_STATUS_TEXT_MAP[row.original.status]}
      </span>
    ),
  },
  {
    accessorKey: "due_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => formatDate(row.original.due_date),
  },
  {
    accessorKey: "createdBy.name",
    header: () => "Created By",
    cell: ({ row }) => row.original.createdBy.name,
  },
];

const filterableColumns: FilterableColumn[] = [
  { accessorKey: "name", title: "Task Name", filterType: "text" },
  {
    accessorKey: "status",
    title: "Status",
    filterType: "select",
    options: Object.entries(PROJECT_STATUS_TEXT_MAP).map(([value, label]) => ({
      value,
      label,
    })),
  },
  {
    accessorKey: "due_date",
    title: "Due Date",
    filterType: "date",
  },
];

export default function Show({ project, tasks, success, queryParams }: Props) {
  queryParams = queryParams || {};

  const user = usePage<PageProps>().props.auth.user;
  const [isInviteFormVisible, setInviteFormVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [noUsersFound, setNoUsersFound] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { data, setData, post, reset, errors } = useForm({
    email: "",
    currentUserEmail: user.email,
  });

  const toggleInviteForm = () => {
    setInviteFormVisible(!isInviteFormVisible);
    setSearchResults([]);
    setNoUsersFound(false);
    setSelectedUser(null);
    reset("email");
  };

  const searchUsers = async () => {
    if (!data.email) return;

    // Reset selected user whenever a new search is performed
    setSelectedUser(null);

    try {
      const response = await fetch(
        route("user.search", { project: project.id }) + `?email=${data.email}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          credentials: "same-origin",
        },
      );

      const result = await response.json();

      // Filter out the logged-in user and existing participants
      const filteredUsers = result.users.filter((user: User) => {
        return (
          user.email !== data.currentUserEmail &&
          !project.invitedUsers.some(
            (invitedUser: User) => invitedUser.email === user.email,
          ) &&
          project.createdBy.email !== user.email
        );
      });

      if (filteredUsers.length > 0) {
        setSearchResults(filteredUsers);
        setNoUsersFound(false);
      } else {
        setSearchResults([]);
        setNoUsersFound(true);
      }
    } catch (error) {
      console.error("Error searching users", error);
      setNoUsersFound(true);
    }
  };

  // Handle Enter key for searching users
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchUsers();
    }
  };

  const selectUser = (user: any) => {
    setSelectedUser(user);
    setSearchResults([]);
    setNoUsersFound(false);
  };

  const submitInvite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedUser) return;

    // Submit the selected user's email
    post(route("project.invite", { project: project.id }), {
      onSuccess: () => {
        toggleInviteForm();
      },
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          {`Project "${project.name}"`}
        </h2>
      }
    >
      <Head title={`Project "${project.name}"`} />

      <div className="space-y-12 py-12">
        <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
          {project.image_path && (
            <img
              src={project.image_path}
              alt="Project Image"
              className="mb-6 h-64 w-full rounded-lg object-cover shadow-md"
            />
          )}

          <div className="space-y-6 rounded-lg bg-white p-6 shadow-lg dark:bg-card dark:text-gray-100">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Project Information Card */}
              <Card className="bg-gray-50 dark:bg-gray-900">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">
                    Project Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Project ID</Label>
                    <p className="text-gray-700 dark:text-gray-300">
                      {project.id}
                    </p>
                  </div>
                  <div>
                    <Label>Project Name</Label>
                    <p className="text-gray-700 dark:text-gray-300">
                      {project.name}
                    </p>
                  </div>
                  <div className="flex flex-col items-baseline space-y-3">
                    <Label>Project Status</Label>
                    <span
                      className={`rounded px-2 py-1 text-white ${PROJECT_STATUS_CLASS_MAP[project.status]}`}
                    >
                      {PROJECT_STATUS_TEXT_MAP[project.status]}
                    </span>
                  </div>

                  <div>
                    <Label>Created By</Label>
                    <p className="text-gray-700 dark:text-gray-300">
                      {project.createdBy.name}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Date & Update Info Card */}
              <Card className="bg-gray-50 dark:bg-gray-900">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">
                    Project Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Due Date</Label>
                    <p className="text-gray-700 dark:text-gray-300">
                      {formatDate(project.due_date)}
                    </p>
                  </div>
                  <div>
                    <Label>Created At</Label>
                    <p className="text-gray-700 dark:text-gray-300">
                      {formatDate(project.created_at)}
                    </p>
                  </div>
                  <div>
                    <Label>Updated By</Label>
                    <p className="text-gray-700 dark:text-gray-300">
                      {project.updatedBy.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description Card */}
            <Card className="bg-gray-50 dark:bg-gray-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Project Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  {project.description}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-card">
            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
              Invite Users
            </h2>

            {!isInviteFormVisible ? (
              <Button className="mt-4" onClick={toggleInviteForm}>
                Invite Users
              </Button>
            ) : (
              <form onSubmit={submitInvite} className="mt-4 space-y-4">
                <Input
                  type="email"
                  placeholder="Enter user's email, then press Enter"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  onKeyDown={onKeyDown}
                  required
                />
                <InputError message={errors.email} />

                {noUsersFound && (
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No users found with this email</AlertTitle>
                  </Alert>
                )}

                {searchResults.length > 0 && (
                  <ul className="mt-2 rounded border p-2">
                    {searchResults.map((user: User) => (
                      <li
                        key={user.id}
                        onClick={() => selectUser(user)}
                        className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        {user.name} ({user.email})
                      </li>
                    ))}
                  </ul>
                )}

                {selectedUser && (
                  <div className="mt-4">
                    <p className="font-semibold">
                      Selected User: {selectedUser.name} ({selectedUser.email})
                    </p>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <Button type="submit" disabled={!selectedUser}>
                    Invite
                  </Button>
                  <Button variant="secondary" onClick={toggleInviteForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-card">
            <h2 className="mb-2 text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
              All Project Tasks
            </h2>
            <DataTable
              columns={columns}
              entity={tasks}
              filterableColumns={filterableColumns}
              queryParams={queryParams}
              routeName="project.show"
              entityId={project.id}
            />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
