-- Fix foreign key relationships for project_members table
ALTER TABLE public.project_members 
ADD CONSTRAINT project_members_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id);

-- Fix foreign key relationships for comments table  
ALTER TABLE public.comments
ADD CONSTRAINT comments_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id);

-- Ensure the project_members and comments have the correct company_id setup
-- Add triggers to ensure data consistency