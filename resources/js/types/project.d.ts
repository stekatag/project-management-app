import { PaginatedUser, User } from "./user";

export type Project = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  due_date: string;
  status: "completed" | "pending" | "in_progress";
  image_path: string;
  createdBy: User;
  updatedBy: User;
  invitedUsers: User[];
  pivot?: {
    user_id: number;
    project_id: number;
    status: "pending" | "accepted" | "rejected";
    created_at: string;
    updated_at: string;
  };
  acceptedUsers: User[];
};

export type PaginatedProject = {
  data: Project[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
};
