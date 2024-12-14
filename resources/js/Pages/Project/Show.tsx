import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import ProjectInfo from "./Partials/ProjectInfo";
import InviteUsers from "./Partials/InviteUsers";
import ProjectTasks from "./Partials/ProjectTasks";
import { Project } from "@/types/project";
import { PaginatedTask } from "@/types/task";
import { QueryParams } from "@/types/utils";

type Props = {
  project: Project;
  tasks: PaginatedTask;
  error: string | null;
  success: string | null;
  queryParams: QueryParams;
  activeTab: string;
  labelOptions: { value: string; label: string }[];
  permissions: {
    canInviteUsers: boolean;
    canEditProject: boolean;
    canManageTasks: boolean;
  };
};

export default function Show({
  project,
  tasks,
  success,
  queryParams,
  error: serverError,
  activeTab: initialActiveTab,
  permissions,
  labelOptions,
}: Props) {
  queryParams = queryParams || {};

  const [activeTab, setActiveTab] = useState(initialActiveTab);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", activeTab);
    window.history.pushState({}, "", url);
  }, [activeTab]);

  const handleInviteClick = () => {
    setActiveTab("invite");
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

      <div className="space-y-12 py-8">
        <div className="mx-auto max-w-7xl space-y-6 px-3 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid auto-cols-[minmax(0,_2fr)] grid-flow-col shadow-sm">
              <TabsTrigger value="tasks">Project Tasks</TabsTrigger>
              <TabsTrigger value="info">Project Info</TabsTrigger>
              {permissions.canInviteUsers && (
                <TabsTrigger value="invite">Invite Users</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="tasks">
              <ProjectTasks
                tasks={tasks}
                queryParams={queryParams}
                projectId={project.id}
                permissions={permissions}
                labelOptions={labelOptions}
              />
            </TabsContent>
            <TabsContent value="info">
              <ProjectInfo
                project={project}
                onInviteClick={handleInviteClick}
                permissions={permissions}
              />
            </TabsContent>
            <TabsContent value="invite">
              <InviteUsers
                project={project}
                success={success}
                serverError={serverError}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
