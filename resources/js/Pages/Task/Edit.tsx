import { Head, Link, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import InputError from "@/Components/InputError";
import { useToast } from "@/hooks/use-toast";
import { DateTimePicker } from "@/Components/ui/time-picker/date-time-picker";
import { PaginatedProject } from "@/types/project";
import { Task } from "@/types/task";
import { PaginatedUser } from "@/types/user";
import MultipleSelector, { Option } from "@/Components/ui/multiple-selector";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Info, Trash2 } from "lucide-react";
import { TaskLabelBadgeVariant } from "@/utils/constants";
import axios from "axios";
import { useState } from "react";
import RichTextEditor from "@/Components/RichTextEditor";

type Props = {
  task: Task;
  projects: PaginatedProject;
  users: PaginatedUser;
  labels: {
    data: Option[];
  };
  canChangeAssignee: boolean;
  statusOptions: Array<{
    value: number | string;
    label: string;
  }>;
};

export default function Edit({
  task,
  projects,
  users,
  labels,
  canChangeAssignee,
  statusOptions,
}: Props) {
  const { data, setData, post, errors } = useForm({
    image: null as File | null,
    name: task.name || "",
    description: task.description || "",
    status_id: task.status?.id?.toString() ?? "",
    due_date: task.due_date || "",
    priority: task.priority || "",
    assigned_user_id: task.assigned_user_id
      ? task.assigned_user_id.toString()
      : "unassigned",
    project_id: task.project_id?.toString() || "",
    label_ids: task.labels.map((label) => label.id),
    _method: "PUT",
  });

  const [selectedLabels, setSelectedLabels] = useState<Option[]>(
    task.labels.map((label) => ({
      label: label.name,
      value: label.id.toString(),
      variant: label.variant as TaskLabelBadgeVariant,
    })),
  );

  const labelOptions: Option[] = labels.data.map((label) => ({
    label: label.name as string,
    value: (label.id ?? "").toString(),
    variant: label.variant as TaskLabelBadgeVariant,
  }));

  const searchLabels = async (query: string): Promise<Option[]> => {
    if (!data.project_id) return [];

    // Return filtered labels immediately (no API call needed)
    return labelOptions.filter((label) =>
      label.label.toLowerCase().includes(query.toLowerCase()),
    );
  };

  const { toast } = useToast();

  const getAssignedUserDisplay = (assignedUserId: string, users: PaginatedUser) => {
    if (!assignedUserId || assignedUserId === "unassigned") {
      return "Unassigned";
    }

    const assignedUser = users?.data.find((u) => u.id.toString() === assignedUserId);

    if (!assignedUser) {
      return "Unassigned";
    }

    return `${assignedUser.name} (${assignedUser.email})`;
  };

  const handleDeleteImage = () => {
    router.delete(route("task.delete-image", task.id), {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Task image deleted successfully",
          variant: "success",
        });
      },
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    post(route("task.update", task.id), {
      preserveState: true,
      onError: (error) => {
        const errorMessage = Object.values(error).join(" ");
        toast({
          title: "Failed to update task",
          variant: "destructive",
          description: errorMessage,
          duration: 5000,
        });
      },
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Edit Task "{task.name}"
        </h2>
      }
    >
      <Head title="Tasks" />

      <div className="py-8">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="space-y-6 bg-white p-4 shadow dark:bg-card sm:rounded-lg sm:p-8"
            >
              {/* Display Existing Task Image */}
              {task.image_path && (
                <div className="space-y-2">
                  <Label>Current Image</Label>
                  <div className="relative w-full max-w-xl">
                    <img
                      src={task.image_path}
                      alt={task.name}
                      className="rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={handleDeleteImage}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Project Selection */}
              <div className="space-y-2">
                <Label htmlFor="task_project_id">
                  Project <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setData("project_id", value)}
                  defaultValue={data.project_id.toString()}
                  disabled={true}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.data.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.project_id} className="mt-2" />
              </div>

              {/* Task Image */}
              <div>
                <Label htmlFor="task_image_path">
                  Task Image{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Input
                  id="task_image_path"
                  type="file"
                  className="mt-1 block w-full"
                  accept=".jpg,.jpeg,.png,.webp,.svg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setData("image", e.target.files[0]);
                    }
                  }}
                />
                <InputError message={errors.image} className="mt-2" />
              </div>

              {/* Task Name */}
              <div className="space-y-2">
                <Label htmlFor="task_name">
                  Task Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="task_name"
                  type="text"
                  placeholder="Enter a task name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  required
                  autoFocus
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              {/* Task Labels */}
              <div className="space-y-2">
                <Label htmlFor="task_labels">
                  Task Labels{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </Label>
                {labels.data.length > 0 ? (
                  <MultipleSelector
                    value={selectedLabels}
                    defaultOptions={labelOptions}
                    placeholder="Select labels..."
                    emptyIndicator="No labels found"
                    onSearch={searchLabels}
                    triggerSearchOnFocus
                    onChange={(selectedLabels) => {
                      setSelectedLabels(selectedLabels);
                      setData(
                        "label_ids",
                        selectedLabels.map((label) => Number(label.value)),
                      );
                    }}
                  />
                ) : (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>No labels found</AlertTitle>
                    <AlertDescription className="mb-1">
                      If you want to label your tasks, please create labels from the
                      button below.
                    </AlertDescription>
                    <Link
                      href={route("task_labels.create", {
                        project_id: data.project_id,
                      })}
                    >
                      <Button variant="secondary">Create Label</Button>
                    </Link>
                  </Alert>
                )}
              </div>

              {/* Task Description */}
              <div className="space-y-2">
                <Label htmlFor="task_description">
                  Task Description{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <RichTextEditor
                  value={data.description}
                  onChange={(content) => setData("description", content)}
                />
                <InputError message={errors.description} className="mt-2" />
              </div>

              {/* Task Deadline */}
              <div className="space-y-2">
                <Label htmlFor="task_due_date">
                  Task Deadline{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <DateTimePicker
                  className="w-full"
                  value={data.due_date ? new Date(data.due_date) : undefined}
                  onChange={(date) =>
                    setData("due_date", date ? date.toISOString() : "")
                  }
                />
                <InputError message={errors.due_date} className="mt-2" />
              </div>

              {/* Task Status */}
              <div className="space-y-2">
                <Label htmlFor="task_status">
                  Task Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setData("status_id", value)}
                  value={data.status_id}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(({ value, label }) => (
                      <SelectItem key={value} value={value.toString()}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.status_id} className="mt-2" />
              </div>

              {/* Task Priority */}
              <div className="space-y-2">
                <Label htmlFor="task_priority">
                  Task Priority <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    setData("priority", value as "low" | "medium" | "high")
                  }
                  defaultValue={data.priority}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <InputError message={errors.priority} className="mt-2" />
              </div>

              {/* Assigned User */}
              <div className="space-y-2">
                <Label htmlFor="task_assigned_user">
                  Assigned User{" "}
                  <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    setData("assigned_user_id", value === "unassigned" ? "" : value)
                  }
                  value={data.assigned_user_id || "unassigned"}
                  disabled={!canChangeAssignee}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {getAssignedUserDisplay(data.assigned_user_id, users)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {users?.data.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.assigned_user_id} className="mt-2" />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <Link href={route("task.index")}>
                  <Button variant="secondary">Cancel</Button>
                </Link>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
