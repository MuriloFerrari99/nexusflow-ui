-- First, drop all existing RLS policies to avoid conflicts
DROP POLICY IF EXISTS "Project creators can manage members" ON public.project_members;
DROP POLICY IF EXISTS "Users can view project members" ON public.project_members;
DROP POLICY IF EXISTS "Users can view company projects" ON public.projects;
DROP POLICY IF EXISTS "Project creators and admins can update" ON public.projects;
DROP POLICY IF EXISTS "Users can view project tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Users can update accessible tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Users can create tasks" ON public.project_tasks;

-- Create optimized security definer functions to avoid recursion
CREATE OR REPLACE FUNCTION public.is_project_member(project_id_param uuid, user_id_param uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF user_id_param IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM public.project_members 
    WHERE project_id = project_id_param AND user_id = user_id_param
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_project_creator(project_id_param uuid, user_id_param uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF user_id_param IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM public.projects 
    WHERE id = project_id_param 
    AND created_by = user_id_param
    AND company_id = get_user_company_id_safe(user_id_param)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.can_edit_project(project_id_param uuid, user_id_param uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF user_id_param IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check if user is admin, creator, or has edit permissions
  RETURN (
    is_company_admin_safe(user_id_param) OR
    is_project_creator(project_id_param, user_id_param) OR
    EXISTS (
      SELECT 1 FROM public.project_members 
      WHERE project_id = project_id_param 
      AND user_id = user_id_param 
      AND can_edit = true
    )
  );
END;
$$;

-- Create new optimized RLS policies

-- Projects table policies
CREATE POLICY "Users can view accessible projects"
ON public.projects
FOR SELECT
TO authenticated
USING (
  company_id = get_user_company_id_safe() AND (
    created_by = auth.uid() OR
    is_company_admin_safe() OR
    is_project_member(id, auth.uid())
  )
);

CREATE POLICY "Users can create company projects"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (
  company_id = get_user_company_id_safe() AND
  created_by = auth.uid()
);

CREATE POLICY "Users can update accessible projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (
  company_id = get_user_company_id_safe() AND
  can_edit_project(id, auth.uid())
);

CREATE POLICY "Project creators and admins can delete projects"
ON public.projects
FOR DELETE
TO authenticated
USING (
  company_id = get_user_company_id_safe() AND (
    created_by = auth.uid() OR
    is_company_admin_safe()
  )
);

-- Project members table policies  
CREATE POLICY "Users can view project members"
ON public.project_members
FOR SELECT
TO authenticated
USING (
  is_project_member(project_id, auth.uid()) OR
  is_project_creator(project_id, auth.uid()) OR
  is_company_admin_safe()
);

CREATE POLICY "Project creators can manage members"
ON public.project_members
FOR ALL
TO authenticated
USING (
  is_project_creator(project_id, auth.uid()) OR
  is_company_admin_safe()
)
WITH CHECK (
  is_project_creator(project_id, auth.uid()) OR
  is_company_admin_safe()
);

-- Project tasks table policies
CREATE POLICY "Users can view project tasks"
ON public.project_tasks
FOR SELECT
TO authenticated
USING (
  assigned_to = auth.uid() OR
  is_project_member(project_id, auth.uid()) OR
  is_project_creator(project_id, auth.uid()) OR
  is_company_admin_safe()
);

CREATE POLICY "Users can create project tasks"
ON public.project_tasks
FOR INSERT
TO authenticated
WITH CHECK (
  created_by = auth.uid() AND (
    is_project_creator(project_id, auth.uid()) OR
    is_company_admin_safe() OR
    EXISTS (
      SELECT 1 FROM public.project_members 
      WHERE project_id = project_tasks.project_id 
      AND user_id = auth.uid() 
      AND can_assign_tasks = true
    )
  )
);

CREATE POLICY "Users can update accessible tasks"
ON public.project_tasks
FOR UPDATE
TO authenticated
USING (
  assigned_to = auth.uid() OR
  created_by = auth.uid() OR
  can_edit_project(project_id, auth.uid())
);

CREATE POLICY "Project creators can delete tasks"
ON public.project_tasks
FOR DELETE
TO authenticated
USING (
  is_project_creator(project_id, auth.uid()) OR
  is_company_admin_safe()
);