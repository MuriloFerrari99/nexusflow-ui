import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Eye, Calendar, User, FileText, Tag } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatBytes } from "@/lib/utils";

interface DocumentViewerProps {
  document: any;
  onClose: () => void;
}

export const DocumentViewer = ({ document, onClose }: DocumentViewerProps) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFileUrl = async () => {
      try {
        const { data } = await supabase.storage
          .from("documents")
          .createSignedUrl(document.file_path, 3600); // 1 hour expiry

        if (data?.signedUrl) {
          setFileUrl(data.signedUrl);
        }
      } catch (error) {
        console.error("Error getting file URL:", error);
      } finally {
        setLoading(false);
      }
    };

    getFileUrl();
  }, [document.file_path]);

  const handleDownload = async () => {
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

  const isPreviewable = (fileType: string) => {
    return fileType?.includes("image/") || fileType?.includes("pdf");
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-xl">{document.name}</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(document.category)}>
                  {document.category}
                </Badge>
                <Badge className={getStatusColor(document.status)}>
                  {document.status}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-6 h-[calc(90vh-200px)]">
          {/* Informações do Documento */}
          <div className="col-span-4 space-y-4 overflow-auto">
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Informações
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Criado em:</span>
                  <span>{format(new Date(document.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Enviado por:</span>
                  <span>{document.profiles?.full_name || "N/A"}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Tamanho:</span>
                  <span>{formatBytes(document.file_size || 0)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Tipo:</span>
                  <span>{document.file_type || "N/A"}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Versão:</span>
                  <span>{document.version}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Descrição */}
            {document.description && (
              <div className="space-y-2">
                <h3 className="font-medium">Descrição</h3>
                <p className="text-sm text-muted-foreground">{document.description}</p>
              </div>
            )}

            {/* Tags */}
            {document.tags && document.tags.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {document.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Data de Vencimento */}
            {document.expires_at && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-medium">Data de Vencimento</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(document.expires_at), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Preview do Arquivo */}
          <div className="col-span-8 bg-muted/30 rounded-lg overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Carregando preview...</p>
                </div>
              </div>
            ) : fileUrl && isPreviewable(document.file_type) ? (
              <div className="h-full">
                {document.file_type?.includes("image/") ? (
                  <img
                    src={fileUrl}
                    alt={document.name}
                    className="w-full h-full object-contain"
                  />
                ) : document.file_type?.includes("pdf") ? (
                  <iframe
                    src={fileUrl}
                    className="w-full h-full border-0"
                    title={document.name}
                  />
                ) : null}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Preview não disponível para este tipo de arquivo</p>
                  <Button className="mt-4" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Baixar para visualizar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};