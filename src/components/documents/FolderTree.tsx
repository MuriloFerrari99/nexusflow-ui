import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, ChevronDown, Folder, FolderPlus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FolderTreeProps {
  selectedFolderId?: string | null;
  onFolderSelect?: (folderId: string | null) => void;
  isManagementMode?: boolean;
}

interface FolderNode {
  id: string;
  name: string;
  description?: string;
  children: FolderNode[];
  document_count?: number;
}

export const FolderTree = ({ selectedFolderId, onFolderSelect, isManagementMode }: FolderTreeProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [newFolderParentId, setNewFolderParentId] = useState<string | null>(null);
  const [editingFolder, setEditingFolder] = useState<any>(null);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: folders, isLoading } = useQuery({
    queryKey: ["document-folders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("document_folders")
        .select(`
          *,
          documents(count)
        `)
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  // Construir árvore hierárquica
  const buildTree = (folders: any[]): FolderNode[] => {
    const folderMap = new Map();
    const roots: FolderNode[] = [];

    // Criar todos os nós
    folders.forEach(folder => {
      folderMap.set(folder.id, {
        ...folder,
        children: [],
        document_count: folder.documents?.[0]?.count || 0
      });
    });

    // Construir hierarquia
    folders.forEach(folder => {
      const node = folderMap.get(folder.id);
      if (folder.parent_id) {
        const parent = folderMap.get(folder.parent_id);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const createFolderMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string; parent_id?: string | null }) => {
      const { error } = await supabase
        .from("document_folders")
        .insert({
          ...data,
          company_id: (await supabase.from("profiles").select("company_id").eq("id", (await supabase.auth.getUser()).data.user?.id).single()).data?.company_id,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-folders"] });
      setShowNewFolderDialog(false);
      setNewFolderParentId(null);
      toast({ title: "Pasta criada com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar pasta",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateFolderMutation = useMutation({
    mutationFn: async (data: { id: string; name: string; description?: string }) => {
      const { error } = await supabase
        .from("document_folders")
        .update({ name: data.name, description: data.description })
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-folders"] });
      setEditingFolder(null);
      toast({ title: "Pasta atualizada com sucesso!" });
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: async (folderId: string) => {
      const { error } = await supabase
        .from("document_folders")
        .delete()
        .eq("id", folderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-folders"] });
      toast({ title: "Pasta excluída com sucesso!" });
    },
  });

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolder = (folder: FolderNode, level = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;

    return (
      <div key={folder.id} className="select-none">
        <div
          className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-accent transition-colors ${
            isSelected ? "bg-accent text-accent-foreground" : ""
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => onFolderSelect?.(folder.id)}
        >
          {folder.children.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          
          <Folder className="h-4 w-4 text-blue-500" />
          <span className="flex-1 text-sm">{folder.name}</span>
          
          {folder.document_count > 0 && (
            <span className="text-xs text-muted-foreground bg-muted px-1 rounded">
              {folder.document_count}
            </span>
          )}

          {isManagementMode && (
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => {
                  setNewFolderParentId(folder.id);
                  setShowNewFolderDialog(true);
                }}
              >
                <FolderPlus className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => setEditingFolder(folder)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={() => deleteFolderMutation.mutate(folder.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {isExpanded && folder.children.map(child => renderFolder(child, level + 1))}
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-4">Carregando pastas...</div>;
  }

  const folderTree = buildTree(folders || []);

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Pastas</CardTitle>
          <div className="flex gap-1">
            <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setNewFolderParentId(null);
                    setShowNewFolderDialog(true);
                  }}
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Pasta</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    createFolderMutation.mutate({
                      name: formData.get("name") as string,
                      description: formData.get("description") as string,
                      parent_id: newFolderParentId,
                    });
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Pasta</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" name="description" rows={3} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowNewFolderDialog(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={createFolderMutation.isPending}>
                      Criar Pasta
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1 p-2">
          {/* Raiz - Todos os documentos */}
          <div
            className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-accent transition-colors ${
              selectedFolderId === null ? "bg-accent text-accent-foreground" : ""
            }`}
            onClick={() => onFolderSelect?.(null)}
          >
            <Folder className="h-4 w-4 text-blue-500" />
            <span className="text-sm">Todos os Documentos</span>
          </div>

          {folderTree.map(folder => renderFolder(folder))}
        </div>
      </CardContent>

      {/* Dialog de Edição */}
      {editingFolder && (
        <Dialog open onOpenChange={() => setEditingFolder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Pasta</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                updateFolderMutation.mutate({
                  id: editingFolder.id,
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                });
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome da Pasta</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingFolder.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingFolder.description || ""}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditingFolder(null)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateFolderMutation.isPending}>
                  Salvar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};