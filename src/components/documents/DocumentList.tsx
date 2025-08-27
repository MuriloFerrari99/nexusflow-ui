import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentViewer } from "./DocumentViewer";
import { DocumentForm } from "./DocumentForm";
import { Search, Filter, Eye, Edit, Download, Trash2, FileText, Calendar, User } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DocumentListProps {
  folderId?: string | null;
}

export const DocumentList = ({ folderId }: DocumentListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: documents, isLoading, refetch } = useQuery({
    queryKey: ["documents", folderId, searchTerm, categoryFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("documents")
        .select(`
          *,
          document_folders(name)
        `)
        .order("created_at", { ascending: false });

      if (folderId) {
        query = query.eq("folder_id", folderId);
      }

      if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`);
      }

      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter as any);
      }

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleDownload = async (document: any) => {
    try {
      const { data } = await supabase.storage
        .from("documents")
        .download(document.file_path);
      
      if (data) {
        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = document.name;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentId);
      
      if (error) throw error;
      refetch();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "expired": return "bg-red-100 text-red-800 border-red-200";
      case "pending_approval": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "archived": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "contracts": return "bg-blue-100 text-blue-800 border-blue-200";
      case "invoices": return "bg-green-100 text-green-800 border-green-200";
      case "hr": return "bg-purple-100 text-purple-800 border-purple-200";
      case "legal": return "bg-red-100 text-red-800 border-red-200";
      case "technical": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando documentos...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="contracts">Contratos</SelectItem>
              <SelectItem value="invoices">Notas Fiscais</SelectItem>
              <SelectItem value="receipts">Comprovantes</SelectItem>
              <SelectItem value="hr">RH</SelectItem>
              <SelectItem value="legal">Jurídico</SelectItem>
              <SelectItem value="technical">Técnico</SelectItem>
              <SelectItem value="financial">Financeiro</SelectItem>
              <SelectItem value="other">Outros</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="expired">Vencido</SelectItem>
              <SelectItem value="pending_approval">Pendente</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            Grade
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            Lista
          </Button>
        </div>
      </div>

      {/* Lista de Documentos */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {documents?.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingDocument(doc)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <h3 className="font-medium text-sm mb-2 line-clamp-2">{doc.name}</h3>
                
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge className={getCategoryColor(doc.category)}>
                      {doc.category}
                    </Badge>
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(doc.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Usuário
                    </div>
                    <div>{formatBytes(doc.file_size || 0)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {documents?.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                    <div className="flex-1">
                      <h3 className="font-medium">{doc.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{formatBytes(doc.file_size || 0)}</span>
                        <span>{format(new Date(doc.created_at), "dd/MM/yyyy", { locale: ptBR })}</span>
                        <span>Usuário</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getCategoryColor(doc.category)}>
                        {doc.category}
                      </Badge>
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingDocument(doc)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Visualizador de Documento */}
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}

      {/* Editor de Documento */}
      {editingDocument && (
        <DocumentForm
          document={editingDocument}
          onClose={() => setEditingDocument(null)}
          onSuccess={() => {
            setEditingDocument(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};