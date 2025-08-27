import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calculator,
  Package,
  Percent,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const mockTaxProfiles = [
  {
    id: "1",
    name: "Produto Padrão - Simples Nacional",
    regime: "sn",
    ncm: "6109.10.00",
    cfopSaida: "5102",
    csosn: "101",
    cargaEfetiva: 6.0,
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2", 
    name: "Serviços de TI - ISS 5%",
    regime: "normal",
    iss: {
      municipio: "São Paulo",
      codigo: "3550308",
      aliquota: 5.0,
    },
    cfopSaida: "5949",
    aliquotaIss: 5.0,
    isActive: true,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    name: "Produto Regime Normal - ICMS 18%",
    regime: "normal",
    ncm: "8471.30.12",
    cfopSaida: "5102",
    cstIcms: "00",
    aliquotaIcms: 18.0,
    aliquotaPis: 1.65,
    aliquotaCofins: 7.6,
    isActive: true,
    createdAt: new Date("2024-01-25"),
  },
];

export const TaxProfileManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getRegimeBadge = (regime: string) => {
    switch (regime) {
      case "sn":
        return <Badge className="bg-blue-500 text-white">Simples Nacional</Badge>;
      case "normal":
        return <Badge className="bg-green-500 text-white">Regime Normal</Badge>;
      default:
        return <Badge variant="secondary">{regime}</Badge>;
    }
  };

  const filteredProfiles = mockTaxProfiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (profile.ncm && profile.ncm.includes(searchTerm))
  );

  const handleEdit = (profile: any) => {
    setEditingProfile(profile);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setEditingProfile(null);
    setIsDialogOpen(true);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Perfis Tributários</h2>
          <p className="text-muted-foreground">
            Configure regras de cálculo de impostos por produto ou serviço
          </p>
        </div>
        
        <Button onClick={handleNew}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Perfil
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nome ou NCM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Perfis Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Simples Nacional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">8</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Regime Normal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">16</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Com ISS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">12</div>
          </CardContent>
        </Card>
      </div>

      {/* Tax Profiles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Perfis Tributários Configurados</CardTitle>
          <CardDescription>
            Gerenciar configurações de cálculo fiscal por produto/serviço
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Regime</TableHead>
                <TableHead>NCM/Código</TableHead>
                <TableHead>CFOP</TableHead>
                <TableHead>Tributação</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-2 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{profile.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {profile.isActive ? "Ativo" : "Inativo"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRegimeBadge(profile.regime)}</TableCell>
                  <TableCell>
                    {profile.ncm && (
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {profile.ncm}
                      </code>
                    )}
                    {profile.iss && (
                      <div className="text-sm text-muted-foreground">
                        Serviço - {profile.iss.municipio}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{profile.cfopSaida}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {profile.cargaEfetiva && (
                        <div className="flex items-center text-sm">
                          <Percent className="w-3 h-3 mr-1" />
                          Carga: {formatPercentage(profile.cargaEfetiva)}
                        </div>
                      )}
                      {profile.aliquotaIcms && (
                        <div className="flex items-center text-sm">
                          <Calculator className="w-3 h-3 mr-1" />
                          ICMS: {formatPercentage(profile.aliquotaIcms)}
                        </div>
                      )}
                      {profile.aliquotaIss && (
                        <div className="flex items-center text-sm">
                          <FileText className="w-3 h-3 mr-1" />
                          ISS: {formatPercentage(profile.aliquotaIss)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(profile.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(profile)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProfiles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum perfil tributário encontrado.
            </div>
          )}
        </CardContent>
      </Card>

      {/* New/Edit Profile Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingProfile ? "Editar Perfil Tributário" : "Novo Perfil Tributário"}
            </DialogTitle>
            <DialogDescription>
              Configure as regras de cálculo de impostos para produtos ou serviços
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Perfil</Label>
                <Input 
                  id="name" 
                  placeholder="Ex: Produto Padrão - SN"
                  defaultValue={editingProfile?.name}
                />
              </div>

              <div>
                <Label htmlFor="regime">Regime Tributário</Label>
                <Select defaultValue={editingProfile?.regime || "sn"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sn">Simples Nacional</SelectItem>
                    <SelectItem value="normal">Regime Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ncm">NCM</Label>
                <Input 
                  id="ncm" 
                  placeholder="Ex: 6109.10.00"
                  defaultValue={editingProfile?.ncm}
                />
              </div>

              <div>
                <Label htmlFor="cfop">CFOP Saída</Label>
                <Input 
                  id="cfop" 
                  placeholder="Ex: 5102"
                  defaultValue={editingProfile?.cfopSaida}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="icms">Alíquota ICMS (%)</Label>
                <Input 
                  id="icms" 
                  type="number" 
                  step="0.01"
                  placeholder="18.00"
                  defaultValue={editingProfile?.aliquotaIcms}
                />
              </div>

              <div>
                <Label htmlFor="pis">Alíquota PIS (%)</Label>
                <Input 
                  id="pis" 
                  type="number" 
                  step="0.01"
                  placeholder="1.65"
                  defaultValue={editingProfile?.aliquotaPis}
                />
              </div>

              <div>
                <Label htmlFor="cofins">Alíquota COFINS (%)</Label>
                <Input 
                  id="cofins" 
                  type="number" 
                  step="0.01"
                  placeholder="7.60"
                  defaultValue={editingProfile?.aliquotaCofins}
                />
              </div>

              <div>
                <Label htmlFor="carga">Carga Efetiva SN (%)</Label>
                <Input 
                  id="carga" 
                  type="number" 
                  step="0.01"
                  placeholder="6.00"
                  defaultValue={editingProfile?.cargaEfetiva}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>
              {editingProfile ? "Salvar Alterações" : "Criar Perfil"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};