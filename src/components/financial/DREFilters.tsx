import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { DateRange } from "react-day-picker";

export interface DREFiltersData {
  period: string;
  dateRange?: DateRange;
  categories: string[];
  projects: string[];
  responsibles: string[];
  comparisonPeriod: string;
}

interface DREFiltersProps {
  filters: DREFiltersData;
  onFiltersChange: (filters: DREFiltersData) => void;
  categories?: Array<{ id: string; name: string }>;
  projects?: Array<{ id: string; name: string }>;
  responsibles?: Array<{ id: string; name: string }>;
}

export function DREFilters({ 
  filters, 
  onFiltersChange,
  categories = [],
  projects = [],
  responsibles = []
}: DREFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilters = (updates: Partial<DREFiltersData>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const removeFilter = (type: keyof DREFiltersData, value: string) => {
    if (type === 'categories' || type === 'projects' || type === 'responsibles') {
      const newArray = filters[type].filter(item => item !== value);
      updateFilters({ [type]: newArray });
    }
  };

  const addFilter = (type: 'categories' | 'projects' | 'responsibles', value: string) => {
    if (!filters[type].includes(value)) {
      updateFilters({ [type]: [...filters[type], value] });
    }
  };

  const clearAllFilters = () => {
    updateFilters({
      period: 'month',
      dateRange: undefined,
      categories: [],
      projects: [],
      responsibles: [],
      comparisonPeriod: 'previous'
    });
  };

  const getActiveFiltersCount = () => {
    return filters.categories.length + filters.projects.length + filters.responsibles.length + 
           (filters.dateRange ? 1 : 0);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Ocultar' : 'Mostrar'} Avançados
            </Button>
            {getActiveFiltersCount() > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filtros Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <Select value={filters.period} onValueChange={(value) => updateFilters({ period: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Semana Atual</SelectItem>
                <SelectItem value="month">Mês Atual</SelectItem>
                <SelectItem value="quarter">Trimestre Atual</SelectItem>
                <SelectItem value="year">Ano Atual</SelectItem>
                <SelectItem value="custom">Período Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Comparação</label>
            <Select 
              value={filters.comparisonPeriod} 
              onValueChange={(value) => updateFilters({ comparisonPeriod: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="previous">Período Anterior</SelectItem>
                <SelectItem value="year_ago">Mesmo Período Ano Passado</SelectItem>
                <SelectItem value="none">Sem Comparação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filters.period === 'custom' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Personalizada</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                          {format(filters.dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                        </>
                      ) : (
                        format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                      )
                    ) : (
                      "Selecionar período"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={filters.dateRange?.from}
                    selected={filters.dateRange}
                    onSelect={(range) => updateFilters({ dateRange: range })}
                    numberOfMonths={2}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Filtros Avançados */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por Categoria */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Categorias</label>
                <Select onValueChange={(value) => addFilter('categories', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Projeto */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Projetos</label>
                <Select onValueChange={(value) => addFilter('projects', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Responsável */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Responsáveis</label>
                <Select onValueChange={(value) => addFilter('responsibles', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {responsibles.map(responsible => (
                      <SelectItem key={responsible.id} value={responsible.id}>
                        {responsible.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags dos Filtros Ativos */}
            {getActiveFiltersCount() > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Filtros Ativos:</label>
                <div className="flex flex-wrap gap-2">
                  {filters.categories.map(categoryId => {
                    const category = categories.find(c => c.id === categoryId);
                    return category ? (
                      <Badge key={categoryId} variant="secondary" className="gap-1">
                        {category.name}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFilter('categories', categoryId)}
                        />
                      </Badge>
                    ) : null;
                  })}
                  
                  {filters.projects.map(projectId => {
                    const project = projects.find(p => p.id === projectId);
                    return project ? (
                      <Badge key={projectId} variant="secondary" className="gap-1">
                        {project.name}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFilter('projects', projectId)}
                        />
                      </Badge>
                    ) : null;
                  })}
                  
                  {filters.responsibles.map(responsibleId => {
                    const responsible = responsibles.find(r => r.id === responsibleId);
                    return responsible ? (
                      <Badge key={responsibleId} variant="secondary" className="gap-1">
                        {responsible.name}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFilter('responsibles', responsibleId)}
                        />
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}