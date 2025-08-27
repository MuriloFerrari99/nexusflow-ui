-- Criar bucket de documentos
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Criar enums para documentos
CREATE TYPE document_status AS ENUM ('active', 'archived', 'expired', 'pending_approval');
CREATE TYPE document_access_level AS ENUM ('public', 'departmental', 'private', 'confidential');
CREATE TYPE document_category AS ENUM ('contracts', 'invoices', 'receipts', 'hr', 'legal', 'technical', 'financial', 'other');
CREATE TYPE permission_type AS ENUM ('view', 'edit', 'delete', 'admin');
CREATE TYPE access_action AS ENUM ('view', 'download', 'edit', 'delete', 'upload');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

-- Tabela de pastas/diretórios
CREATE TABLE public.document_folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  parent_id UUID REFERENCES public.document_folders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  access_level document_access_level DEFAULT 'departmental',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela principal de documentos
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  folder_id UUID REFERENCES public.document_folders(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  category document_category DEFAULT 'other',
  tags TEXT[],
  status document_status DEFAULT 'active',
  access_level document_access_level DEFAULT 'departmental',
  expires_at TIMESTAMP WITH TIME ZONE,
  version INTEGER DEFAULT 1,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de versionamento
CREATE TABLE public.document_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  changes_description TEXT,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de permissões específicas
CREATE TABLE public.document_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES public.document_folders(id) ON DELETE CASCADE,
  user_id UUID,
  department_id UUID,
  permission_type permission_type NOT NULL,
  granted_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT check_target CHECK (
    (document_id IS NOT NULL AND folder_id IS NULL) OR 
    (document_id IS NULL AND folder_id IS NOT NULL)
  ),
  CONSTRAINT check_recipient CHECK (
    (user_id IS NOT NULL AND department_id IS NULL) OR 
    (user_id IS NULL AND department_id IS NOT NULL)
  )
);

-- Tabela de log de acessos
CREATE TABLE public.document_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action_type access_action NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de aprovações/workflow
CREATE TABLE public.document_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL,
  status approval_status DEFAULT 'pending',
  comments TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX idx_documents_company_id ON public.documents(company_id);
CREATE INDEX idx_documents_folder_id ON public.documents(folder_id);
CREATE INDEX idx_documents_category ON public.documents(category);
CREATE INDEX idx_documents_status ON public.documents(status);
CREATE INDEX idx_documents_tags ON public.documents USING GIN(tags);
CREATE INDEX idx_document_folders_company_id ON public.document_folders(company_id);
CREATE INDEX idx_document_folders_parent_id ON public.document_folders(parent_id);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.document_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_approvals ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para document_folders
CREATE POLICY "Users can manage company document folders" ON public.document_folders
  FOR ALL USING (company_id = get_user_company_id());

-- Políticas RLS para documents
CREATE POLICY "Users can manage company documents" ON public.documents
  FOR ALL USING (company_id = get_user_company_id());

-- Políticas RLS para document_versions
CREATE POLICY "Users can manage company document versions" ON public.document_versions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.documents d 
    WHERE d.id = document_versions.document_id 
    AND d.company_id = get_user_company_id()
  ));

-- Políticas RLS para document_permissions
CREATE POLICY "Users can manage company document permissions" ON public.document_permissions
  FOR ALL USING (
    (document_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.documents d 
      WHERE d.id = document_permissions.document_id 
      AND d.company_id = get_user_company_id()
    )) OR
    (folder_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.document_folders f 
      WHERE f.id = document_permissions.folder_id 
      AND f.company_id = get_user_company_id()
    ))
  );

-- Políticas RLS para document_access_logs
CREATE POLICY "Users can view company document access logs" ON public.document_access_logs
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.documents d 
    WHERE d.id = document_access_logs.document_id 
    AND d.company_id = get_user_company_id()
  ));

CREATE POLICY "System can create document access logs" ON public.document_access_logs
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.documents d 
    WHERE d.id = document_access_logs.document_id 
    AND d.company_id = get_user_company_id()
  ));

-- Políticas RLS para document_approvals
CREATE POLICY "Users can manage company document approvals" ON public.document_approvals
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.documents d 
    WHERE d.id = document_approvals.document_id 
    AND d.company_id = get_user_company_id()
  ));

-- Políticas de Storage para bucket documents
CREATE POLICY "Users can view company documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND 
    (storage.foldername(name))[1] = get_user_company_id()::text
  );

CREATE POLICY "Users can upload company documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    (storage.foldername(name))[1] = get_user_company_id()::text
  );

CREATE POLICY "Users can update company documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' AND 
    (storage.foldername(name))[1] = get_user_company_id()::text
  );

CREATE POLICY "Users can delete company documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND 
    (storage.foldername(name))[1] = get_user_company_id()::text
  );

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_document_folders_updated_at
  BEFORE UPDATE ON public.document_folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();