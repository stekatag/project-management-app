import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Link, router } from "@inertiajs/react";
import { formatDate } from "@/utils/helpers";
import { Project } from "@/types/project";
import { DataTableRowActions } from "@/Components/data-table-components/data-table-row-actions";
import { Row } from "@tanstack/react-table";
import { Plus, UsersRound } from "lucide-react";

import { STATUS_CONFIG, type StatusType } from "@/utils/constants";

type ProjectCardsProps = {
  projects: Project[];
  permissions: { [key: number]: boolean };
  userId: number;
};

export default function ProjectCards({
  projects,
  permissions,
  userId,
}: ProjectCardsProps) {
  const calculateTaskProgress = (totalTasks: number, completedTasks: number) => {
    // Ensure we have valid numbers and use optional chaining
    const total = Number(totalTasks ?? 0);
    const completed = Number(completedTasks ?? 0);

    if (total === 0) return 0;
    const percentage = (completed / total) * 100;
    return Math.round(percentage * 10) / 10;
  };

  return (
    <div
      className={`grid flex-1 gap-6 ${projects.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"}`}
    >
      {projects.slice(0, 6).map((project) => {
        // Use default status config if status not found
        const StatusIcon =
          STATUS_CONFIG[project.status as StatusType]?.icon ||
          STATUS_CONFIG.default.icon;

        const tasksProgress = calculateTaskProgress(
          project.total_tasks,
          project.completed_tasks,
        );

        return (
          <div key={project.id} className="min-w-0 rounded-lg bg-card p-5 shadow">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <Link
                  href={route("project.show", project.id)}
                  className="truncate text-lg font-semibold"
                  title={project.name}
                >
                  {project.name}
                </Link>
                <span
                  className="shrink-0"
                  title={STATUS_CONFIG[project.status as StatusType].text}
                >
                  <StatusIcon
                    className={`h-5 w-5 ${STATUS_CONFIG[project.status as StatusType].color}`}
                  />
                </span>
              </div>
              <span className="shrink-0">
                <DataTableRowActions
                  row={{ original: project } as Row<Project>}
                  onView={() => router.get(route("project.show", project.id))}
                  onEdit={() => router.get(route("project.edit", project.id))}
                  onDelete={() =>
                    router.delete(route("project.destroy", project.id))
                  }
                  onLeave={() => {
                    router.post(route("project.leave", { project: project.id }), {
                      preserveScroll: true,
                    });
                  }}
                  isProjectTable={true}
                  isCreator={project.created_by === userId}
                  canEdit={permissions[project.id]}
                  customActions={[
                    {
                      icon: Plus,
                      label: "Create Task",
                      onClick: (row) =>
                        router.get(
                          route("task.create", {
                            project_id: row.original.id,
                          }),
                        ),
                    },
                    ...(permissions[project.id]
                      ? [
                          {
                            icon: UsersRound,
                            label: "Invite User",
                            onClick: (row: Row<Project>) =>
                              router.get(
                                route("project.show", {
                                  project: row.original.id,
                                  tab: "invite",
                                }),
                              ),
                          },
                        ]
                      : []),
                  ]}
                />
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Created on {formatDate(project.created_at)}
            </p>

            <ul className="mt-3 space-y-1.5 text-sm text-gray-800 dark:text-gray-200">
              {project.tasks.slice(0, 5).map((task) => {
                // Use default status config if status not found
                const statusConfig = task.status?.slug
                  ? STATUS_CONFIG[task.status.slug as StatusType] ||
                    STATUS_CONFIG.default
                  : STATUS_CONFIG.default;
                const TaskStatusIcon = statusConfig.icon;
                const primaryLabel = task.labels?.[0]; // Get first label if it exists

                return (
                  <li key={task.id} className="min-w-0">
                    <Link
                      className="group flex min-w-0 items-center gap-2 rounded-md p-1 transition-colors hover:bg-accent/50"
                      href={route("task.show", task.id)}
                      title={task.name}
                    >
                      <span className="shrink-0" title={statusConfig.text}>
                        <TaskStatusIcon
                          className={`h-4 w-4 ${statusConfig.color}`}
                        />
                      </span>
                      <span
                        className={`min-w-0 flex-1 truncate ${
                          task.status === "completed" ? "line-through" : ""
                        }`}
                      >
                        {task.name}
                      </span>
                      {primaryLabel && (
                        <Badge variant={primaryLabel.variant} className="shrink-0">
                          {primaryLabel.name}
                        </Badge>
                      )}
                    </Link>
                  </li>
                );
              })}
              {project.tasks.length > 5 && (
                <li className="text-gray-500">+ more tasks...</li>
              )}
            </ul>

            <div className="mt-3">
              <Progress value={tasksProgress} className="h-2" />
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                {tasksProgress}% Complete
                <span className="ml-1">
                  ({project.completed_tasks ?? 0}/{project.total_tasks ?? 0} tasks)
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
