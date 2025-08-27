import { useState } from "react";
import { DocumentList } from "./DocumentList";
import { DocumentUpload } from "./DocumentUpload";
import { FolderTree } from "./FolderTree";
import { DocumentDashboard } from "./DocumentDashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FolderOpen, BarChart3, File } from "lucide-react";

export const DocumentManager = () => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documentos</h1>
          <p className="text-muted-foreground">
            Gerencie documentos da sua empresa com segurança e organização
          </p>
        </div>
        <Button onClick={() => setShowUpload(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          Fazer Upload
        </Button>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList>
          <TabsTrigger value="documents" className="gap-2">
            <File className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="folders" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            Pastas
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <FolderTree
                selectedFolderId={selectedFolderId}
                onFolderSelect={setSelectedFolderId}
              />
            </div>
            <div className="col-span-9">
              <DocumentList folderId={selectedFolderId} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="folders">
          <FolderTree
            selectedFolderId={selectedFolderId}
            onFolderSelect={setSelectedFolderId}
            isManagementMode={true}
          />
        </TabsContent>

        <TabsContent value="dashboard">
          <DocumentDashboard />
        </TabsContent>
      </Tabs>

      {showUpload && (
        <DocumentUpload
          folderId={selectedFolderId}
          onClose={() => setShowUpload(false)}
          onSuccess={() => {
            setShowUpload(false);
            // Trigger refresh of document list
          }}
        />
      )}
    </div>
  );
};