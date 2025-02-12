import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Eye, Pencil, Trash2, UserPlus, UserMinus, LogOut } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { LucideIcon } from "lucide-react";

interface CustomAction {
  icon: LucideIcon;
  label: string;
  onClick: (row: Row<any>) => void;
  showSeparator?: boolean;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onView?: (row: Row<TData>) => void;
  onEdit?: (row: Row<TData>) => void;
  onDelete?: (row: Row<TData>) => void;
  onAssign?: (row: Row<TData>) => void;
  onUnassign?: (row: Row<TData>) => void;
  onLeave?: (row: Row<TData>) => void;
  canEdit?: boolean;
  isProjectTable?: boolean;
  isCreator?: boolean;
  customActions?: CustomAction[];
}

export function DataTableRowActions<TData>({
  row,
  onView,
  onEdit,
  onDelete,
  onAssign,
  onUnassign,
  onLeave,
  canEdit = true,
  isProjectTable = false,
  isCreator = false,
  customActions = [],
}: DataTableRowActionsProps<TData>) {
  const { auth } = usePage<PageProps>().props;
  const task = row.original as any;
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // Handle different data shapes for project tasks and global tasks
  const assignedUserId = task.assigned_user_id ?? task.assignedUser?.id;
  const canBeAssigned = !assignedUserId;
  const isAssignedToCurrentUser = assignedUserId === auth.user.id;
  const canEditTask = isAssignedToCurrentUser || canEdit; // canEdit represents project manager privileges

  const handleDeleteClick = () => {
    showConfirmation({
      title: "Confirm Task Deletion",
      description:
        "Are you sure you want to delete this task? This action cannot be undone.",
      action: () => onDelete?.(row),
      actionText: "Delete",
    });
  };

  const handleAssignClick = () => {
    showConfirmation({
      title: "Confirm Task Assignment",
      description: "Are you sure you want to assign this task to yourself?",
      action: () => onAssign?.(row),
      actionText: "Assign",
    });
  };

  const handleUnassignClick = () => {
    showConfirmation({
      title: "Confirm Task Unassignment",
      description: "Are you sure you want to unassign yourself from this task?",
      action: () => onUnassign?.(row),
      actionText: "Unassign",
    });
  };

  const handleLeaveClick = () => {
    showConfirmation({
      title: "Confirm Project Leave",
      description: "Are you sure you want to leave this project?",
      action: () => onLeave?.(row),
      actionText: "Leave",
    });
  };

  // Determine if delete action should be shown
  const shouldShowDelete =
    onDelete &&
    (isProjectTable
      ? isCreator // For projects, only show if user is creator
      : (task.can?.delete ?? true)); // For tasks and labels, show if explicitly allowed or default to true

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {/* Standard Actions */}
          {onView && (
            <DropdownMenuItem onClick={() => onView(row)}>
              <Eye className="h-4 w-4" />
              <span>View</span>
            </DropdownMenuItem>
          )}

          {canEditTask && onEdit && (
            <DropdownMenuItem onClick={() => onEdit(row)}>
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
          )}

          {!isProjectTable && (
            <>
              {canBeAssigned && onAssign && (
                <DropdownMenuItem onClick={handleAssignClick}>
                  <UserPlus className="h-4 w-4" />
                  <span>Assign to me</span>
                </DropdownMenuItem>
              )}

              {isAssignedToCurrentUser && onUnassign && (
                <DropdownMenuItem onClick={handleUnassignClick}>
                  <UserMinus className="h-4 w-4" />
                  <span>Unassign</span>
                </DropdownMenuItem>
              )}
            </>
          )}

          {/* Custom Actions */}
          {customActions.map((action, index) => (
            <div key={index}>
              <DropdownMenuItem onClick={() => action.onClick(row)}>
                {action.icon && <action.icon className="h-4 w-4" />}
                <span>{action.label}</span>
              </DropdownMenuItem>
              {action.showSeparator && <DropdownMenuSeparator />}
            </div>
          ))}

          {isProjectTable && !isCreator && onLeave && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={handleLeaveClick}>
                <LogOut className="h-4 w-4" />
                <span>Leave Project</span>
              </DropdownMenuItem>
            </>
          )}

          {shouldShowDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={handleDeleteClick}>
                <Trash2 className="h-4 w-4" />
                <span>
                  {isProjectTable && isCreator ? "Delete Project" : "Delete"}
                </span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog />
    </>
  );
}
