-- Check and fix project_members table foreign key to profiles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'project_members_user_id_fkey'
    ) THEN
        ALTER TABLE public.project_members 
        ADD CONSTRAINT project_members_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id);
    END IF;
END $$;