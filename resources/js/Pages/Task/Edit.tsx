import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
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
import { Info } from "lucide-react";
import { TaskLabelBadgeVariant } from "@/utils/constants";
import axios from "axios";
import { useState } from "react";

type Props = {
  task: Task;
  projects: PaginatedProject;
  users: PaginatedUser;
  labels: {
    data: Option[];
  };
  canChangeAssignee: boolean;
};

export default function Edit({
  task,
  projects,
  users,
  labels,
  canChangeAssignee,
}: Props) {
  const { data, setData, post, errors } = useForm({
    image: null as File | null,
    name: task.name || "",
    description: task.description || "",
    status: task.status || "",
    due_date: task.due_date || "",
    priority: task.priority || "",
    assigned_user_id: task.assigned_user_id || "",
    project_id: task.project_id || "",
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

  const searchLabels = async (query: string) => {
    const response = await axios.get(route("task_labels.search"), {
      params: {
        query,
        project_id: data.project_id,
      },
    });
    const labels = response.data;
    return labels.map((label: any) => ({
      label: label.name,
      value: label.id.toString(),
      variant: label.variant as TaskLabelBadgeVariant,
    }));
  };

  const { toast } = useToast();

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
                <img
                  src={task.image_path}
                  alt={task.name}
                  className="d-block mb-4 w-64 rounded-sm"
                />
              )}

              {/* Project Selection */}
              <div className="space-y-2">
                <Label htmlFor="task_project_id">Project</Label>
                <Select
                  onValueChange={(value) => setData("project_id", value)}
                  defaultValue={data.project_id.toString()}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.data.map((project) => (
                      <SelectItem
                        key={project.id}
                        value={project.id.toString()}
                      >
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.project_id} className="mt-2" />
              </div>

              {/* Task Image */}
              <div>
                <Label htmlFor="task_image_path">Task Image</Label>
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
                <Label htmlFor="task_name">Task Name</Label>
                <Input
                  id="task_name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  required
                  autoFocus
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              {/* Task Labels */}
              <div className="space-y-2">
                <Label htmlFor="task_labels">Task Labels</Label>
                {labels.data.length > 0 ? (
                  <MultipleSelector
                    value={selectedLabels}
                    defaultOptions={labelOptions}
                    placeholder="Select labels..."
                    emptyIndicator="No labels found"
                    onSearch={searchLabels}
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
                      If you want to label your tasks, please create labels from
                      the button below.
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
                <Label htmlFor="task_description">Task Description</Label>
                <Textarea
                  id="task_description"
                  value={data.description}
                  onChange={(e) => setData("description", e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
              </div>

              {/* Task Deadline */}
              <div className="space-y-2">
                <Label htmlFor="task_due_date">Task Deadline</Label>
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
                <Label htmlFor="task_status">Task Status</Label>
                <Select
                  onValueChange={(value) =>
                    setData(
                      "status",
                      value as "completed" | "pending" | "in_progress",
                    )
                  }
                  defaultValue={data.status}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <InputError message={errors.status} className="mt-2" />
              </div>

              {/* Task Priority */}
              <div className="space-y-2">
                <Label htmlFor="task_priority">Task Priority</Label>
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
                <Label htmlFor="task_assigned_user">Assigned User</Label>
                <Select
                  onValueChange={(value) => setData("assigned_user_id", value)}
                  defaultValue={data.assigned_user_id.toString()}
                  disabled={!canChangeAssignee}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select User" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.data.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError
                  message={errors.assigned_user_id}
                  className="mt-2"
                />
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
