import { Head, Link, useForm } from "@inertiajs/react";
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
import { PaginatedUser } from "@/types/user";
import MultipleSelector, { Option } from "@/Components/ui/multiple-selector";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Info } from "lucide-react";
import { TaskLabelBadgeVariant } from "@/utils/constants";
import axios from "axios";
import { useState, useEffect } from "react";
import RichTextEditor from "@/Components/RichTextEditor";

type Props = {
  projects: PaginatedProject;
  users: PaginatedUser;
  labels: {
    data: Option[];
  };
  currentUserId: number;
  selectedProjectId?: number;
  fromProjectPage?: boolean;
  statusOptions: Array<{
    value: number | string;
    label: string;
  }>;
};

export default function Create({
  projects,
  users: initialUsers,
  labels,
  currentUserId,
  selectedProjectId,
  fromProjectPage,
  statusOptions: initialStatusOptions,
}: Props) {
  const [canAssignOthers, setCanAssignOthers] = useState(true);
  const [users, setUsers] = useState<PaginatedUser>(initialUsers || { data: [] });
  const [statusOptions, setStatusOptions] = useState(initialStatusOptions);

  const { data, setData, post, errors, reset } = useForm({
    image: null as File | null,
    name: "",
    description: "",
    status_id: "",
    due_date: "",
    priority: "",
    assigned_user_id: canAssignOthers ? "" : currentUserId.toString(),
    project_id: selectedProjectId?.toString() || "",
    label_ids: [] as number[],
  });

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

    post(route("task.store"), {
      preserveState: true,
      onSuccess: () => reset(),
      onError: (error) => {
        const errorMessage = Object.values(error).join(" ");
        toast({
          title: "Failed to create task",
          variant: "destructive",
          description: errorMessage,
          duration: 5000,
        });
      },
    });
  };

  const checkProjectRole = async (projectId: string) => {
    try {
      const response = await axios.get(route("project.check-role", projectId));
      const isProjectMember = response.data.isProjectMember;

      setCanAssignOthers(!isProjectMember);

      // If project member, set their ID and update users list to only include themselves
      if (isProjectMember) {
        setData("assigned_user_id", currentUserId.toString());
        setUsers({
          data: [
            {
              id: currentUserId,
              name:
                initialUsers.data.find((u) => u.id === currentUserId)?.name || "",
              email:
                initialUsers.data.find((u) => u.id === currentUserId)?.email || "",
            },
          ],
        });
      }
    } catch (error) {
      console.error("Failed to check project role:", error);
    }
  };

  const fetchProjectUsers = async (projectId: string) => {
    try {
      const response = await axios.get(route("task.users", projectId));
      setUsers(response.data.users || { data: [] });
    } catch (error) {
      console.error("Failed to fetch project users:", error);
      setUsers({ data: [] }); // Set empty data on error
      toast({
        title: "Error",
        description: "Failed to fetch project users",
        variant: "destructive",
      });
    }
  };

  const handleProjectChange = async (projectId: string) => {
    setData("project_id", projectId);

    try {
      // Fetch project role and users
      await checkProjectRole(projectId);
      await fetchProjectUsers(projectId);

      // Fetch project-specific status options
      const response = await axios.get(route("task.statuses", projectId));
      if (response.data.statusOptions) {
        setStatusOptions(response.data.statusOptions);
        // Reset status selection when options change
        setData("status_id", "");
      }
    } catch (error) {
      console.error("Failed to fetch project data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch project data",
        variant: "destructive",
      });
    }
  };

  // Initialize project selection and fetch related data if coming from project page
  useEffect(() => {
    if (selectedProjectId) {
      handleProjectChange(selectedProjectId.toString());
    }
  }, [selectedProjectId]);

  // Disable project selection if coming from project page
  const isProjectSelectionDisabled = fromProjectPage;

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Create New Task{" "}
          {selectedProjectId
            ? `for ${projects.data.find((p) => p.id === selectedProjectId)?.name}`
            : ""}
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
              {/* Project Selection */}
              <div className="space-y-2">
                <Label htmlFor="task_project_id">
                  Project <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={handleProjectChange}
                  defaultValue={selectedProjectId?.toString()}
                  disabled={isProjectSelectionDisabled}
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
                    defaultOptions={labelOptions}
                    placeholder="Select labels..."
                    emptyIndicator="No labels found"
                    onSearch={searchLabels}
                    onChange={(selectedLabels) =>
                      setData(
                        "label_ids",
                        selectedLabels.map((label) => Number(label.value)),
                      )
                    }
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
                  value={data.status_id?.toString()}
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
                  onValueChange={(value) => setData("priority", value)}
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
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {users.data.map((user) => (
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
                <Button variant="secondary" onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
