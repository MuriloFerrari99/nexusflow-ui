import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, X, File, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadProps {
  folderId?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface UploadFile {
  file: File;
  name: string;
  description: string;
  category: string;
  tags: string[];
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

export const DocumentUpload = ({ folderId, onClose, onSuccess }: DocumentUploadProps) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      name: file.name,
      description: "",
      category: "other",
      tags: [],
      status: "pending" as const,
      progress: 0,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      "text/*": [".txt"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const updateFile = (index: number, updates: Partial<UploadFile>) => {
    setFiles(prev => prev.map((file, i) => i === index ? { ...file, ...updates } : file));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = (index: number, tag: string) => {
    if (tag.trim()) {
      updateFile(index, {
        tags: [...files[index].tags, tag.trim()]
      });
    }
  };

  const removeTag = (index: number, tagIndex: number) => {
    updateFile(index, {
      tags: files[index].tags.filter((_, i) => i !== tagIndex)
    });
  };

  const uploadFile = async (fileData: UploadFile, index: number) => {
    try {
      updateFile(index, { status: "uploading", progress: 0 });

      // Get user company ID
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) throw new Error("Usuário não autenticado");

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", profile.user.id)
        .single();

      if (!userProfile) throw new Error("Perfil do usuário não encontrado");

      const companyId = userProfile.company_id;
      const timestamp = new Date().toISOString().slice(0, 10);
      const filePath = `${companyId}/${fileData.category}/${timestamp}/${fileData.file.name}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, fileData.file);

      if (uploadError) throw uploadError;

      // Create document record
      const { error: dbError } = await supabase
        .from("documents")
        .insert({
          company_id: companyId,
          folder_id: folderId,
          name: fileData.name,
          description: fileData.description,
          file_path: uploadData.path,
          file_size: fileData.file.size,
          file_type: fileData.file.type,
          category: fileData.category as any,
          tags: fileData.tags,
          uploaded_by: profile.user.id,
        });

      if (dbError) throw dbError;

      updateFile(index, { status: "success", progress: 100 });
      
    } catch (error: any) {
      updateFile(index, { 
        status: "error", 
        error: error.message || "Erro no upload" 
      });
    }
  };

  const handleUploadAll = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      const uploadPromises = files
        .filter(f => f.status === "pending")
        .map((file, originalIndex) => {
          const actualIndex = files.findIndex(f => f === file);
          return uploadFile(file, actualIndex);
        });

      await Promise.all(uploadPromises);

      const successCount = files.filter(f => f.status === "success").length;
      const errorCount = files.filter(f => f.status === "error").length;

      if (successCount > 0) {
        toast({
          title: "Upload concluído",
          description: `${successCount} arquivo(s) enviado(s) com sucesso.`,
        });
      }

      if (errorCount > 0) {
        toast({
          title: "Alguns arquivos falharam",
          description: `${errorCount} arquivo(s) falharam no upload.`,
          variant: "destructive",
        });
      }

      if (errorCount === 0) {
        onSuccess();
      }
      
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro durante o upload dos arquivos.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Upload de Documentos</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Área de Drop */}
          <Card>
            <CardContent className="p-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">
                  {isDragActive ? "Solte os arquivos aqui" : "Arraste arquivos ou clique para selecionar"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Suporta PDF, DOC, XLS, imagens e texto (máx. 50MB)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Arquivos */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Arquivos para Upload</h3>
              
              {files.map((fileData, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <File className="h-5 w-5" />
                        <div>
                          <h4 className="font-medium">{fileData.file.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {fileData.status === "success" && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {fileData.status === "error" && (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(index)}
                          disabled={isUploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {fileData.status === "uploading" && (
                      <Progress value={fileData.progress} className="mt-2" />
                    )}
                    
                    {fileData.status === "error" && (
                      <p className="text-sm text-red-500 mt-2">{fileData.error}</p>
                    )}
                  </CardHeader>
                  
                  {fileData.status === "pending" && (
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nome do Documento</Label>
                          <Input
                            value={fileData.name}
                            onChange={(e) => updateFile(index, { name: e.target.value })}
                            disabled={isUploading}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Categoria</Label>
                          <Select
                            value={fileData.category}
                            onValueChange={(value) => updateFile(index, { category: value })}
                            disabled={isUploading}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
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
                        </div>
                        
                        <div className="space-y-2 col-span-2">
                          <Label>Descrição</Label>
                          <Textarea
                            value={fileData.description}
                            onChange={(e) => updateFile(index, { description: e.target.value })}
                            disabled={isUploading}
                            rows={2}
                          />
                        </div>
                        
                        <div className="space-y-2 col-span-2">
                          <Label>Tags</Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {fileData.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="gap-1">
                                {tag}
                                <X 
                                  className="h-3 w-3 cursor-pointer" 
                                  onClick={() => removeTag(index, tagIndex)}
                                />
                              </Badge>
                            ))}
                          </div>
                          <Input
                            placeholder="Adicionar tag (Enter para confirmar)"
                            disabled={isUploading}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addTag(index, e.currentTarget.value);
                                e.currentTarget.value = "";
                              }
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Botões de Ação */}
          {files.length > 0 && (
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose} disabled={isUploading}>
                Cancelar
              </Button>
              <Button onClick={handleUploadAll} disabled={isUploading || files.every(f => f.status !== "pending")}>
                {isUploading ? "Enviando..." : `Enviar ${files.filter(f => f.status === "pending").length} arquivo(s)`}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};