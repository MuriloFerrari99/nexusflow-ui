import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, X, Filter, RotateCcw } from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnalyticsFiltersProps {
  filters: {
    dateRange: { from: Date | null; to: Date | null };
    users: string[];
    modules: string[];
    categories: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const modules = [
  { id: "estoque", name: "Estoque" },
  { id: "financeiro", name: "Financeiro" },
  { id: "rh", name: "RH" },
  { id: "projetos", name: "Projetos" },
  { id: "crm", name: "CRM" },
];

const datePresets = [
  { label: "Hoje", value: "today", getDates: () => ({ from: new Date(), to: new Date() }) },
  { label: "Últimos 7 dias", value: "7days", getDates: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  { label: "Últimos 30 dias", value: "30days", getDates: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
  { label: "Este mês", value: "thisMonth", getDates: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
];

export function AnalyticsFilters({ filters, onFiltersChange }: AnalyticsFiltersProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const { data: users } = useQuery({
    queryKey: ["company-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .order("full_name");

      if (error) throw error;
      return data;
    },
  });

  const handleDatePreset = (preset: string) => {
    const presetConfig = datePresets.find(p => p.value === preset);
    if (presetConfig) {
      const dates = presetConfig.getDates();
      onFiltersChange({
        ...filters,
        dateRange: dates,
      });
    }
  };

  const handleDateRangeChange = (range: { from: Date | null; to: Date | null }) => {
    onFiltersChange({
      ...filters,
      dateRange: range,
    });
  };

  const handleUserToggle = (userId: string) => {
    const newUsers = filters.users.includes(userId)
      ? filters.users.filter(id => id !== userId)
      : [...filters.users, userId];
    
    onFiltersChange({
      ...filters,
      users: newUsers,
    });
  };

  const handleModuleToggle = (moduleId: string) => {
    const newModules = filters.modules.includes(moduleId)
      ? filters.modules.filter(id => id !== moduleId)
      : [...filters.modules, moduleId];
    
    onFiltersChange({
      ...filters,
      modules: newModules,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      dateRange: { from: null, to: null },
      users: [],
      modules: [],
      categories: [],
    });
  };

  const hasActiveFilters = 
    filters.dateRange.from || 
    filters.users.length > 0 || 
    filters.modules.length > 0 || 
    filters.categories.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Date Range Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Período</label>
          <div className="flex items-center gap-2">
            <Select onValueChange={handleDatePreset}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Período rápido" />
              </SelectTrigger>
              <SelectContent>
                {datePresets.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-64 justify-start text-left font-normal",
                    !filters.dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "dd/MM/yyyy")} -{" "}
                        {format(filters.dateRange.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(filters.dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    "Selecionar período"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={filters.dateRange.from || new Date()}
                  selected={{
                    from: filters.dateRange.from || undefined,
                    to: filters.dateRange.to || undefined,
                  }}
                  onSelect={(range) => {
                    handleDateRangeChange({
                      from: range?.from || null,
                      to: range?.to || null,
                    });
                    if (range?.from && range?.to) {
                      setDatePickerOpen(false);
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Users Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Usuários</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-40 justify-between">
                <span className="truncate">
                  {filters.users.length === 0 
                    ? "Todos usuários" 
                    : `${filters.users.length} selecionados`
                  }
                </span>
                <Filter className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                {users?.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={user.id}
                      checked={filters.users.includes(user.id)}
                      onCheckedChange={() => handleUserToggle(user.id)}
                    />
                    <label
                      htmlFor={user.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {user.full_name}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Modules Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Módulos</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-40 justify-between">
                <span className="truncate">
                  {filters.modules.length === 0 
                    ? "Todos módulos" 
                    : `${filters.modules.length} selecionados`
                  }
                </span>
                <Filter className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                {modules.map((module) => (
                  <div key={module.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={module.id}
                      checked={filters.modules.includes(module.id)}
                      onCheckedChange={() => handleModuleToggle(module.id)}
                    />
                    <label
                      htmlFor={module.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {module.name}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          
          {filters.dateRange.from && (
            <Badge variant="secondary" className="gap-1">
              {filters.dateRange.to ? (
                `${format(filters.dateRange.from, "dd/MM")} - ${format(filters.dateRange.to, "dd/MM")}`
              ) : (
                format(filters.dateRange.from, "dd/MM/yyyy")
              )}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleDateRangeChange({ from: null, to: null })}
              />
            </Badge>
          )}

          {filters.users.map((userId) => {
            const user = users?.find(u => u.id === userId);
            return (
              <Badge key={userId} variant="secondary" className="gap-1">
                {user?.full_name}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => handleUserToggle(userId)}
                />
              </Badge>
            );
          })}

          {filters.modules.map((moduleId) => {
            const module = modules.find(m => m.id === moduleId);
            return (
              <Badge key={moduleId} variant="secondary" className="gap-1">
                {module?.name}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => handleModuleToggle(moduleId)}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}