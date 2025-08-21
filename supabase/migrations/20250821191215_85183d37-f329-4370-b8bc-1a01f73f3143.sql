-- Criar apenas os enums que não existem
CREATE TYPE project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled');
CREATE TYPE project_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Tabela de projetos
CREATE TABLE public.projects (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    budget NUMERIC(12,2),
    status project_status NOT NULL DEFAULT 'planning',
    priority project_priority NOT NULL DEFAULT 'medium',
    progress NUMERIC(5,2) DEFAULT 0,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de tarefas do projeto (usando task_status e task_priority existentes)
CREATE TABLE public.project_tasks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'todo',
    priority task_priority NOT NULL DEFAULT 'medium',
    start_date DATE,
    due_date DATE,
    estimated_hours NUMERIC(8,2),
    actual_hours NUMERIC(8,2) DEFAULT 0,
    progress NUMERIC(5,2) DEFAULT 0,
    assigned_to UUID,
    created_by UUID NOT NULL,
    parent_task_id UUID,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_task_id) REFERENCES public.project_tasks(id) ON DELETE CASCADE
);

-- Tabela de membros do projeto
CREATE TABLE public.project_members (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    can_edit BOOLEAN DEFAULT false,
    can_assign_tasks BOOLEAN DEFAULT false,
    added_by UUID NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE,
    UNIQUE(project_id, user_id)
);

-- Tabela de dependências de tarefas
CREATE TABLE public.task_dependencies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL,
    depends_on_task_id UUID NOT NULL,
    dependency_type TEXT DEFAULT 'finish_to_start',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    FOREIGN KEY (task_id) REFERENCES public.project_tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (depends_on_task_id) REFERENCES public.project_tasks(id) ON DELETE CASCADE,
    UNIQUE(task_id, depends_on_task_id)
);

-- Habilitar RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_dependencies ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para projects
CREATE POLICY "Users can view company projects" ON public.projects
FOR SELECT USING (
    company_id = get_user_company_id() AND 
    (created_by = auth.uid() OR 
     EXISTS (SELECT 1 FROM public.project_members WHERE project_id = projects.id AND user_id = auth.uid()) OR
     is_company_admin())
);

CREATE POLICY "Users can create projects" ON public.projects
FOR INSERT WITH CHECK (
    company_id = get_user_company_id() AND created_by = auth.uid()
);

CREATE POLICY "Project creators and admins can update" ON public.projects
FOR UPDATE USING (
    company_id = get_user_company_id() AND 
    (created_by = auth.uid() OR is_company_admin() OR
     EXISTS (SELECT 1 FROM public.project_members WHERE project_id = projects.id AND user_id = auth.uid() AND can_edit = true))
);

CREATE POLICY "Project creators and admins can delete" ON public.projects
FOR DELETE USING (
    company_id = get_user_company_id() AND 
    (created_by = auth.uid() OR is_company_admin())
);

-- Políticas RLS para project_tasks
CREATE POLICY "Users can view project tasks" ON public.project_tasks
FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_tasks.project_id AND p.company_id = get_user_company_id() AND 
            (p.created_by = auth.uid() OR 
             EXISTS (SELECT 1 FROM public.project_members WHERE project_id = p.id AND user_id = auth.uid()) OR
             is_company_admin()))
);

CREATE POLICY "Users can create tasks" ON public.project_tasks
FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_tasks.project_id AND p.company_id = get_user_company_id() AND 
            (p.created_by = auth.uid() OR 
             EXISTS (SELECT 1 FROM public.project_members WHERE project_id = p.id AND user_id = auth.uid() AND can_assign_tasks = true) OR
             is_company_admin())) AND
    created_by = auth.uid()
);

CREATE POLICY "Users can update accessible tasks" ON public.project_tasks
FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_tasks.project_id AND p.company_id = get_user_company_id() AND 
            (p.created_by = auth.uid() OR 
             EXISTS (SELECT 1 FROM public.project_members WHERE project_id = p.id AND user_id = auth.uid() AND can_edit = true) OR
             assigned_to = auth.uid() OR
             is_company_admin()))
);

CREATE POLICY "Users can delete tasks" ON public.project_tasks
FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_tasks.project_id AND p.company_id = get_user_company_id() AND 
            (p.created_by = auth.uid() OR created_by = auth.uid() OR is_company_admin()))
);

-- Políticas RLS para project_members
CREATE POLICY "Users can view project members" ON public.project_members
FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_members.project_id AND p.company_id = get_user_company_id() AND 
            (p.created_by = auth.uid() OR user_id = auth.uid() OR is_company_admin()))
);

CREATE POLICY "Project creators can manage members" ON public.project_members
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_members.project_id AND p.company_id = get_user_company_id() AND 
            (p.created_by = auth.uid() OR is_company_admin()))
);

-- Políticas RLS para task_dependencies
CREATE POLICY "Users can view task dependencies" ON public.task_dependencies
FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.project_tasks pt 
            INNER JOIN public.projects p ON p.id = pt.project_id 
            WHERE pt.id = task_dependencies.task_id AND p.company_id = get_user_company_id() AND 
            (p.created_by = auth.uid() OR 
             EXISTS (SELECT 1 FROM public.project_members WHERE project_id = p.id AND user_id = auth.uid()) OR
             is_company_admin()))
);

CREATE POLICY "Users can manage task dependencies" ON public.task_dependencies
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.project_tasks pt 
            INNER JOIN public.projects p ON p.id = pt.project_id 
            WHERE pt.id = task_dependencies.task_id AND p.company_id = get_user_company_id() AND 
            (p.created_by = auth.uid() OR 
             EXISTS (SELECT 1 FROM public.project_members WHERE project_id = p.id AND user_id = auth.uid() AND can_edit = true) OR
             is_company_admin()))
);

-- Função para atualizar progresso do projeto
CREATE OR REPLACE FUNCTION update_project_progress()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.projects 
    SET progress = COALESCE((
        SELECT AVG(
            CASE 
                WHEN status = 'done' THEN 100
                WHEN status = 'in_progress' THEN 50
                ELSE 0
            END
        )
        FROM public.project_tasks 
        WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
    ), 0),
    updated_at = now()
    WHERE id = COALESCE(NEW.project_id, OLD.project_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar progresso
CREATE TRIGGER update_project_progress_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.project_tasks
    FOR EACH ROW EXECUTE FUNCTION update_project_progress();

-- Trigger para updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_tasks_updated_at
    BEFORE UPDATE ON public.project_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();