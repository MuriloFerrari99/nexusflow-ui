import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Table, Image } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

interface ExportMenuProps {
  dashboardId: string;
  dashboardName: string;
}

export function ExportMenu({ dashboardId, dashboardName }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false);

  const createExportRecord = useMutation({
    mutationFn: async (data: {
      export_type: string;
      file_url?: string;
      status: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      // Temporarily disabled until migration is approved
      console.log("Export record:", data);
    },
  });

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.querySelector('[data-dashboard-content]') as HTMLElement;
      if (!element) {
        toast.error("Conteúdo do dashboard não encontrado");
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${dashboardName}_${new Date().toISOString().split('T')[0]}.pdf`);

      await createExportRecord.mutateAsync({
        export_type: "pdf",
        status: "completed",
      });

      toast.success("Dashboard exportado para PDF com sucesso!");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast.error("Erro ao exportar para PDF");
      
      await createExportRecord.mutateAsync({
        export_type: "pdf",
        status: "failed",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      // Sample data - in a real implementation, this would come from the dashboard widgets
      const sampleData = [
        { Métrica: "Receita Total", Valor: 125450, Período: "Janeiro 2024" },
        { Métrica: "Leads Gerados", Valor: 250, Período: "Janeiro 2024" },
        { Métrica: "Conversão", Valor: 15.5, Período: "Janeiro 2024" },
        { Métrica: "Ticket Médio", Valor: 501.8, Período: "Janeiro 2024" },
      ];

      const ws = XLSX.utils.json_to_sheet(sampleData);
      const wb = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet(wb, ws, "Dashboard");
      XLSX.writeFile(wb, `${dashboardName}_${new Date().toISOString().split('T')[0]}.xlsx`);

      await createExportRecord.mutateAsync({
        export_type: "excel",
        status: "completed",
      });

      toast.success("Dashboard exportado para Excel com sucesso!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Erro ao exportar para Excel");
      
      await createExportRecord.mutateAsync({
        export_type: "excel",
        status: "failed",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      // Sample data - in a real implementation, this would come from the dashboard widgets
      const sampleData = [
        { Métrica: "Receita Total", Valor: 125450, Período: "Janeiro 2024" },
        { Métrica: "Leads Gerados", Valor: 250, Período: "Janeiro 2024" },
        { Métrica: "Conversão", Valor: 15.5, Período: "Janeiro 2024" },
        { Métrica: "Ticket Médio", Valor: 501.8, Período: "Janeiro 2024" },
      ];

      const csvContent = [
        Object.keys(sampleData[0]).join(","),
        ...sampleData.map(row => Object.values(row).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `${dashboardName}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      await createExportRecord.mutateAsync({
        export_type: "csv",
        status: "completed",
      });

      toast.success("Dashboard exportado para CSV com sucesso!");
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      toast.error("Erro ao exportar para CSV");
      
      await createExportRecord.mutateAsync({
        export_type: "csv",
        status: "failed",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToImage = async () => {
    setIsExporting(true);
    try {
      const element = document.querySelector('[data-dashboard-content]') as HTMLElement;
      if (!element) {
        toast.error("Conteúdo do dashboard não encontrado");
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement("a");
      link.download = `${dashboardName}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast.success("Dashboard exportado como imagem com sucesso!");
    } catch (error) {
      console.error("Error exporting to image:", error);
      toast.error("Erro ao exportar como imagem");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? "Exportando..." : "Exportar"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToPDF} disabled={isExporting}>
          <FileText className="w-4 h-4 mr-2" />
          Exportar como PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel} disabled={isExporting}>
          <Table className="w-4 h-4 mr-2" />
          Exportar como Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToCSV} disabled={isExporting}>
          <Table className="w-4 h-4 mr-2" />
          Exportar como CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToImage} disabled={isExporting}>
          <Image className="w-4 h-4 mr-2" />
          Exportar como Imagem
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}