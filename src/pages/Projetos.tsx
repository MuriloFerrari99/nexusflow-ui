import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectDashboard } from "@/components/projects/ProjectDashboard";
import { ProjectKanban } from "@/components/projects/ProjectKanban";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectGantt } from "@/components/projects/ProjectGantt";

const Projetos = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie projetos, tarefas e colaboração da equipe
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="gantt">Gantt</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <ProjectDashboard />
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <ProjectList />
          </TabsContent>

          <TabsContent value="kanban" className="space-y-4">
            <ProjectKanban />
          </TabsContent>

          <TabsContent value="gantt" className="space-y-4">
            <ProjectGantt />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Projetos;