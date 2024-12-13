import { DataTable } from "@/Components/data-table-components/data-table";
import { DataTableColumnHeader } from "@/Components/data-table-components/data-table-column-header";
import { Badge } from "@/Components/ui/badge";
import { formatDate } from "@/utils/helpers";
import {
  TASK_PRIORITY_BADGE_MAP,
  TASK_PRIORITY_TEXT_MAP,
  PROJECT_STATUS_BADGE_MAP,
  PROJECT_STATUS_TEXT_MAP,
} from "@/utils/constants";
import { ColumnDef } from "@/Components/data-table-components/data-table";
import { PaginatedTask, Task } from "@/types/task";
import { FilterableColumn, QueryParams } from "@/types/utils";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { CirclePlus } from "lucide-react";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";

type Props = {
  tasks: PaginatedTask;
  queryParams: QueryParams;
  projectId: number;
  labelOptions: { value: string; label: string }[];
  permissions: {
    canManageTasks: boolean;
  };
};

export default function ProjectTasks({
  tasks,
  queryParams,
  projectId,
  permissions,
  labelOptions,
}: Props) {
  queryParams = queryParams || {};

  const columns: ColumnDef<Task, any>[] = [
    {
      accessorKey: "task_number",
      header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
      cell: ({ row }) => `#${row.original.task_number}`,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Task Name" />
      ),
      cell: ({ row }) => (
        <>
          <Link href={route("task.show", row.original.id)}>
            {row.original.labels?.map((label) => (
              <Badge key={label.id} variant={label.variant} className="mr-1.5">
                {label.name}
              </Badge>
            ))}
            {row.original.name}
          </Link>
        </>
      ),
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }) => (
        <Badge variant={TASK_PRIORITY_BADGE_MAP[row.original.priority]}>
          {TASK_PRIORITY_TEXT_MAP[row.original.priority]}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <Badge variant={PROJECT_STATUS_BADGE_MAP[row.original.status]}>
          {PROJECT_STATUS_TEXT_MAP[row.original.status]}
        </Badge>
      ),
    },
    {
      accessorKey: "due_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Due Date" />
      ),
      cell: ({ row }) =>
        row.original.due_date ? formatDate(row.original.due_date) : "No date",
    },
    {
      accessorKey: "assignedUser.name",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Assigned To" />
      ),
      cell: ({ row }) => row.original.assignedUser?.name ?? "Unassigned",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onView={(row) => {
            const taskId = row.original.id;
            router.get(route("task.show", taskId));
          }}
          onEdit={(row) => {
            const taskId = row.original.id;
            router.get(route("task.edit", taskId));
          }}
          onDelete={(row) => {
            const taskId = row.original.id;
            router.delete(route("task.destroy", taskId));
          }}
          onAssign={(row) => {
            router.post(route("task.assignToMe", row.original.id));
          }}
          onUnassign={(row) => {
            router.post(route("task.unassign", row.original.id));
          }}
          canEdit={permissions.canManageTasks}
        />
      ),
    },
    {
      accessorKey: "label_ids",
      defaultHidden: true,
      hideFromViewOptions: true,
    },
  ];

  const filterableColumns: FilterableColumn[] = [
    { accessorKey: "name", title: "Task Name", filterType: "text" },
    {
      accessorKey: "label_ids",
      title: "Labels",
      filterType: "select",
      options: labelOptions,
    },
    {
      accessorKey: "priority",
      title: "Priority",
      filterType: "select",
      options: Object.entries(TASK_PRIORITY_TEXT_MAP).map(([value, label]) => ({
        value,
        label,
      })),
    },
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

  return (
    <div className="rounded-lg bg-card p-4 shadow-sm sm:p-6">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          All Project Tasks
        </h2>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Link href={route("task.create")}>
            <Button className="w-full sm:w-auto">
              <CirclePlus className="h-5 w-5" />
              <span>Create Task</span>
            </Button>
          </Link>
        </div>
      </header>

      <DataTable
        columns={columns}
        entity={tasks}
        filterableColumns={filterableColumns}
        queryParams={queryParams}
        routeName="project.show"
        entityId={projectId}
      />
    </div>
  );
}
