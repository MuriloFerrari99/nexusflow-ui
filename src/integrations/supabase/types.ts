export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      access_department_members: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          department_id: string
          id: string
          role_in_department:
            | Database["public"]["Enums"]["department_role"]
            | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          department_id: string
          id?: string
          role_in_department?:
            | Database["public"]["Enums"]["department_role"]
            | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          department_id?: string
          id?: string
          role_in_department?:
            | Database["public"]["Enums"]["department_role"]
            | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_department_members_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_department_members_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "access_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_department_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      access_departments: {
        Row: {
          code: string
          company_id: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          settings: Json | null
          supervisor_id: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          company_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          settings?: Json | null
          supervisor_id?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          company_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          settings?: Json | null
          supervisor_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_departments_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      access_module_permissions: {
        Row: {
          company_id: string
          created_at: string | null
          department_specific: boolean | null
          id: string
          module_name: string
          permissions: Json
          role_type: Database["public"]["Enums"]["hierarchical_role"]
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          department_specific?: boolean | null
          id?: string
          module_name: string
          permissions?: Json
          role_type: Database["public"]["Enums"]["hierarchical_role"]
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          department_specific?: boolean | null
          id?: string
          module_name?: string
          permissions?: Json
          role_type?: Database["public"]["Enums"]["hierarchical_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      accounts_receivable: {
        Row: {
          amount: number
          company_id: string
          created_at: string
          created_by: string
          customer_document: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          description: string | null
          discount_amount: number | null
          due_date: string
          external_id: string | null
          id: string
          interest_rate: number | null
          invoice_number: string | null
          issue_date: string
          late_fee: number | null
          paid_amount: number | null
          paid_at: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          company_id: string
          created_at?: string
          created_by: string
          customer_document: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          description?: string | null
          discount_amount?: number | null
          due_date: string
          external_id?: string | null
          id?: string
          interest_rate?: number | null
          invoice_number?: string | null
          issue_date?: string
          late_fee?: number | null
          paid_amount?: number | null
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string
          created_by?: string
          customer_document?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          description?: string | null
          discount_amount?: number | null
          due_date?: string
          external_id?: string | null
          id?: string
          interest_rate?: number | null
          invoice_number?: string | null
          issue_date?: string
          late_fee?: number | null
          paid_amount?: number | null
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Relationships: []
      }
      activity_logs: {
        Row: {
          action: string
          company_id: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: unknown | null
          module: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          company_id: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown | null
          module: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          company_id?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown | null
          module?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_feedback: {
        Row: {
          company_id: string
          created_at: string | null
          feedback_data: Json | null
          feedback_type: string
          id: string
          insight_id: string
          insight_type: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          feedback_data?: Json | null
          feedback_type: string
          id?: string
          insight_id: string
          insight_type: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          feedback_data?: Json | null
          feedback_type?: string
          id?: string
          insight_id?: string
          insight_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_feedback_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_dashboards: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string
          description: string | null
          filters: Json
          id: string
          is_active: boolean | null
          is_default: boolean | null
          layout: Json
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          filters?: Json
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          layout?: Json
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          filters?: Json
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          layout?: Json
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics_filters: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string
          description: string | null
          filter_config: Json
          id: string
          is_global: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          filter_config?: Json
          id?: string
          is_global?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          filter_config?: Json
          id?: string
          is_global?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics_metrics: {
        Row: {
          calculation_type: string
          company_id: string
          created_at: string | null
          created_by: string
          data_source: string
          description: string | null
          filters: Json | null
          formula: Json | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          calculation_type: string
          company_id: string
          created_at?: string | null
          created_by: string
          data_source: string
          description?: string | null
          filters?: Json | null
          formula?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          calculation_type?: string
          company_id?: string
          created_at?: string | null
          created_by?: string
          data_source?: string
          description?: string | null
          filters?: Json | null
          formula?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics_reports: {
        Row: {
          company_id: string
          config: Json
          created_at: string | null
          created_by: string
          file_path: string | null
          id: string
          is_active: boolean | null
          last_generated_at: string | null
          name: string
          output_format: string | null
          report_type: string
          schedule_cron: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          config?: Json
          created_at?: string | null
          created_by: string
          file_path?: string | null
          id?: string
          is_active?: boolean | null
          last_generated_at?: string | null
          name: string
          output_format?: string | null
          report_type: string
          schedule_cron?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          config?: Json
          created_at?: string | null
          created_by?: string
          file_path?: string | null
          id?: string
          is_active?: boolean | null
          last_generated_at?: string | null
          name?: string
          output_format?: string | null
          report_type?: string
          schedule_cron?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics_widgets: {
        Row: {
          config: Json
          created_at: string | null
          dashboard_id: string
          data_source: string
          id: string
          is_active: boolean | null
          position: Json
          refresh_interval: number | null
          title: string
          updated_at: string | null
          widget_type: string
        }
        Insert: {
          config?: Json
          created_at?: string | null
          dashboard_id: string
          data_source: string
          id?: string
          is_active?: boolean | null
          position?: Json
          refresh_interval?: number | null
          title: string
          updated_at?: string | null
          widget_type: string
        }
        Update: {
          config?: Json
          created_at?: string | null
          dashboard_id?: string
          data_source?: string
          id?: string
          is_active?: boolean | null
          position?: Json
          refresh_interval?: number | null
          title?: string
          updated_at?: string | null
          widget_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_widgets_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "analytics_dashboards"
            referencedColumns: ["id"]
          },
        ]
      }
      api_endpoints: {
        Row: {
          api_id: string
          created_at: string | null
          description: string | null
          endpoint: string
          id: string
          is_active: boolean | null
          method: string
          name: string
          parameters: Json | null
          response_mapping: Json | null
          updated_at: string | null
        }
        Insert: {
          api_id: string
          created_at?: string | null
          description?: string | null
          endpoint: string
          id?: string
          is_active?: boolean | null
          method: string
          name: string
          parameters?: Json | null
          response_mapping?: Json | null
          updated_at?: string | null
        }
        Update: {
          api_id?: string
          created_at?: string | null
          description?: string | null
          endpoint?: string
          id?: string
          is_active?: boolean | null
          method?: string
          name?: string
          parameters?: Json | null
          response_mapping?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_endpoints_api_id_fkey"
            columns: ["api_id"]
            isOneToOne: false
            referencedRelation: "external_apis"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          category: string
          company_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_valid: boolean | null
          key_name: string
          key_value: string
          last_validated: string | null
          updated_at: string
        }
        Insert: {
          category: string
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_valid?: boolean | null
          key_name: string
          key_value: string
          last_validated?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_valid?: boolean | null
          key_name?: string
          key_value?: string
          last_validated?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_requests: {
        Row: {
          approval_notes: string | null
          approved_at: string | null
          approver_id: string | null
          company_id: string
          created_at: string | null
          current_discount_limit: number
          id: string
          justification: string | null
          proposal_id: string | null
          requested_by: string | null
          requested_discount: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approval_notes?: string | null
          approved_at?: string | null
          approver_id?: string | null
          company_id: string
          created_at?: string | null
          current_discount_limit: number
          id?: string
          justification?: string | null
          proposal_id?: string | null
          requested_by?: string | null
          requested_discount: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approval_notes?: string | null
          approved_at?: string | null
          approver_id?: string | null
          company_id?: string
          created_at?: string | null
          current_discount_limit?: number
          id?: string
          justification?: string | null
          proposal_id?: string | null
          requested_by?: string | null
          requested_discount?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_requests_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          company_id: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          company_id: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          company_id?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_rate_limits: {
        Row: {
          attempt_type: string
          attempts: number | null
          blocked_until: string | null
          created_at: string | null
          email: string | null
          first_attempt: string | null
          id: string
          ip_address: unknown
          last_attempt: string | null
        }
        Insert: {
          attempt_type: string
          attempts?: number | null
          blocked_until?: string | null
          created_at?: string | null
          email?: string | null
          first_attempt?: string | null
          id?: string
          ip_address: unknown
          last_attempt?: string | null
        }
        Update: {
          attempt_type?: string
          attempts?: number | null
          blocked_until?: string | null
          created_at?: string | null
          email?: string | null
          first_attempt?: string | null
          id?: string
          ip_address?: unknown
          last_attempt?: string | null
        }
        Relationships: []
      }
      automation_execution_logs: {
        Row: {
          action_type: string | null
          automation_id: string
          company_id: string
          execution_time: string | null
          id: string
          lead_id: string | null
          opportunity_id: string | null
          result_data: Json | null
          status: string | null
          step_id: string | null
        }
        Insert: {
          action_type?: string | null
          automation_id: string
          company_id: string
          execution_time?: string | null
          id?: string
          lead_id?: string | null
          opportunity_id?: string | null
          result_data?: Json | null
          status?: string | null
          step_id?: string | null
        }
        Update: {
          action_type?: string | null
          automation_id?: string
          company_id?: string
          execution_time?: string | null
          id?: string
          lead_id?: string | null
          opportunity_id?: string | null
          result_data?: Json | null
          status?: string | null
          step_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_execution_logs_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "automations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_execution_logs_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "automation_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_logs_automation"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "automations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_logs_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_logs_lead"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_logs_opportunity"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_executions: {
        Row: {
          automation_id: string
          deal_id: string | null
          error_message: string | null
          executed_at: string
          id: string
          results: Json
          status: string
          trigger_data: Json
        }
        Insert: {
          automation_id: string
          deal_id?: string | null
          error_message?: string | null
          executed_at?: string
          id?: string
          results?: Json
          status?: string
          trigger_data?: Json
        }
        Update: {
          automation_id?: string
          deal_id?: string | null
          error_message?: string | null
          executed_at?: string
          id?: string
          results?: Json
          status?: string
          trigger_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "automation_executions_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "stage_automations"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_steps: {
        Row: {
          automation_id: string
          condicao: Json | null
          created_at: string | null
          delay_segundos: number | null
          id: string
          ordem: number
          payload_json: Json
          tipo_acao: string
        }
        Insert: {
          automation_id: string
          condicao?: Json | null
          created_at?: string | null
          delay_segundos?: number | null
          id?: string
          ordem: number
          payload_json?: Json
          tipo_acao: string
        }
        Update: {
          automation_id?: string
          condicao?: Json | null
          created_at?: string | null
          delay_segundos?: number | null
          id?: string
          ordem?: number
          payload_json?: Json
          tipo_acao?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_steps_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "automations"
            referencedColumns: ["id"]
          },
        ]
      }
      automations: {
        Row: {
          ativo: boolean | null
          company_id: string
          criado_em: string | null
          criado_por: string
          descricao: string | null
          id: string
          nome: string
          pipeline_id: string | null
          stage_id: string | null
          trigger_conditions: Json | null
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          company_id: string
          criado_em?: string | null
          criado_por: string
          descricao?: string | null
          id?: string
          nome: string
          pipeline_id?: string | null
          stage_id?: string | null
          trigger_conditions?: Json | null
          trigger_type?: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          company_id?: string
          criado_em?: string | null
          criado_por?: string
          descricao?: string | null
          id?: string
          nome?: string
          pipeline_id?: string | null
          stage_id?: string | null
          trigger_conditions?: Json | null
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_automations_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_automations_creator"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_automations_pipeline"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "pipelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_automations_stage"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_reconciliations: {
        Row: {
          account_id: string
          company_id: string
          created_at: string
          difference_amount: number | null
          id: string
          period_end: string
          period_start: string
          reconciled_by: string | null
          reconciliation_date: string
          status: string
          total_bank_balance: number | null
          total_system_balance: number | null
          updated_at: string
        }
        Insert: {
          account_id: string
          company_id: string
          created_at?: string
          difference_amount?: number | null
          id?: string
          period_end: string
          period_start: string
          reconciled_by?: string | null
          reconciliation_date?: string
          status?: string
          total_bank_balance?: number | null
          total_system_balance?: number | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          company_id?: string
          created_at?: string
          difference_amount?: number | null
          id?: string
          period_end?: string
          period_start?: string
          reconciled_by?: string | null
          reconciliation_date?: string
          status?: string
          total_bank_balance?: number | null
          total_system_balance?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_reconciliations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "financial_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_statement_items: {
        Row: {
          amount: number
          balance: number | null
          created_at: string
          description: string
          document_number: string | null
          id: string
          matched_transaction_id: string | null
          reconciliation_id: string
          transaction_date: string
        }
        Insert: {
          amount: number
          balance?: number | null
          created_at?: string
          description: string
          document_number?: string | null
          id?: string
          matched_transaction_id?: string | null
          reconciliation_id: string
          transaction_date: string
        }
        Update: {
          amount?: number
          balance?: number | null
          created_at?: string
          description?: string
          document_number?: string | null
          id?: string
          matched_transaction_id?: string | null
          reconciliation_id?: string
          transaction_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_statement_items_reconciliation_id_fkey"
            columns: ["reconciliation_id"]
            isOneToOne: false
            referencedRelation: "bank_reconciliations"
            referencedColumns: ["id"]
          },
        ]
      }
      barcode_entries: {
        Row: {
          barcode: string
          company_id: string
          created_at: string
          created_by: string
          id: string
          movement_type: string
          processed: boolean
          product_id: string | null
          quantity: number
        }
        Insert: {
          barcode: string
          company_id: string
          created_at?: string
          created_by: string
          id?: string
          movement_type: string
          processed?: boolean
          product_id?: string | null
          quantity?: number
        }
        Update: {
          barcode?: string
          company_id?: string
          created_at?: string
          created_by?: string
          id?: string
          movement_type?: string
          processed?: boolean
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "barcode_entries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          final_price: number | null
          id: string
          margin_percentage: number | null
          products: Json | null
          proposal_id: string | null
          supplier_name: string | null
          total_cost: number | null
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          final_price?: number | null
          id?: string
          margin_percentage?: number | null
          products?: Json | null
          proposal_id?: string | null
          supplier_name?: string | null
          total_cost?: number | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          final_price?: number | null
          id?: string
          margin_percentage?: number | null
          products?: Json | null
          proposal_id?: string | null
          supplier_name?: string | null
          total_cost?: number | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budgets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          assigned_to: string
          call_type: string
          company_id: string
          contact_name: string
          created_at: string
          created_by: string
          duration_minutes: number | null
          ended_at: string | null
          feedback: string | null
          id: string
          lead_id: string | null
          next_action: string | null
          notes: string | null
          opportunity_id: string | null
          origin_source: string | null
          phone_number: string
          priority: string
          scheduled_at: string
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to: string
          call_type?: string
          company_id: string
          contact_name: string
          created_at?: string
          created_by: string
          duration_minutes?: number | null
          ended_at?: string | null
          feedback?: string | null
          id?: string
          lead_id?: string | null
          next_action?: string | null
          notes?: string | null
          opportunity_id?: string | null
          origin_source?: string | null
          phone_number: string
          priority?: string
          scheduled_at: string
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string
          call_type?: string
          company_id?: string
          contact_name?: string
          created_at?: string
          created_by?: string
          duration_minutes?: number | null
          ended_at?: string | null
          feedback?: string | null
          id?: string
          lead_id?: string | null
          next_action?: string | null
          notes?: string | null
          opportunity_id?: string | null
          origin_source?: string | null
          phone_number?: string
          priority?: string
          scheduled_at?: string
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      channels: {
        Row: {
          admin_fixed_fee: number | null
          cofins_percent: number | null
          company_id: string
          created_at: string | null
          gateway_percent: number | null
          icms_percent: number | null
          id: string
          is_active: boolean | null
          iss_percent: number | null
          marketplace_percent: number | null
          name: string
          pis_percent: number | null
          sales_commission_percent: number | null
          tax_burden_percent: number | null
          updated_at: string | null
        }
        Insert: {
          admin_fixed_fee?: number | null
          cofins_percent?: number | null
          company_id: string
          created_at?: string | null
          gateway_percent?: number | null
          icms_percent?: number | null
          id?: string
          is_active?: boolean | null
          iss_percent?: number | null
          marketplace_percent?: number | null
          name: string
          pis_percent?: number | null
          sales_commission_percent?: number | null
          tax_burden_percent?: number | null
          updated_at?: string | null
        }
        Update: {
          admin_fixed_fee?: number | null
          cofins_percent?: number | null
          company_id?: string
          created_at?: string | null
          gateway_percent?: number | null
          icms_percent?: number | null
          id?: string
          is_active?: boolean | null
          iss_percent?: number | null
          marketplace_percent?: number | null
          name?: string
          pis_percent?: number | null
          sales_commission_percent?: number | null
          tax_burden_percent?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      checklist_templates: {
        Row: {
          checklist_items: Json
          company_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          checklist_items?: Json
          company_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          checklist_items?: Json
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_timeline: {
        Row: {
          account_receivable_id: string
          automated: boolean
          company_id: string
          created_at: string
          event_data: Json
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          account_receivable_id: string
          automated?: boolean
          company_id: string
          created_at?: string
          event_data?: Json
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          account_receivable_id?: string
          automated?: boolean
          company_id?: string
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collection_timeline_account_receivable_id_fkey"
            columns: ["account_receivable_id"]
            isOneToOne: false
            referencedRelation: "accounts_receivable"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          company_id: string
          content: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          mentions: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          content: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          mentions?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          content?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          mentions?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      commission_payments: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          base_salary: number
          bonus_amount: number
          commission_amount: number
          company_id: string
          created_at: string | null
          id: string
          paid_at: string | null
          period_end: string
          period_start: string
          status: Database["public"]["Enums"]["commission_status"] | null
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          base_salary: number
          bonus_amount?: number
          commission_amount?: number
          company_id: string
          created_at?: string | null
          id?: string
          paid_at?: string | null
          period_end: string
          period_start: string
          status?: Database["public"]["Enums"]["commission_status"] | null
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          base_salary?: number
          bonus_amount?: number
          commission_amount?: number
          company_id?: string
          created_at?: string | null
          id?: string
          paid_at?: string | null
          period_end?: string
          period_start?: string
          status?: Database["public"]["Enums"]["commission_status"] | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_payments_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_rules: {
        Row: {
          bonus_amount: number | null
          commission_rate: number
          company_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          max_percentage: number
          min_percentage: number
          name: string
          updated_at: string | null
        }
        Insert: {
          bonus_amount?: number | null
          commission_rate: number
          company_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_percentage: number
          min_percentage: number
          name: string
          updated_at?: string | null
        }
        Update: {
          bonus_amount?: number | null
          commission_rate?: number
          company_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_percentage?: number
          min_percentage?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_interactions: {
        Row: {
          channel: Database["public"]["Enums"]["communication_channel"]
          clicked_at: string | null
          company_id: string
          content: string | null
          created_at: string | null
          created_by: string | null
          delivered_at: string | null
          direction: string | null
          execution_id: string | null
          id: string
          lead_id: string | null
          metadata: Json | null
          opened_at: string | null
          opportunity_id: string | null
          replied_at: string | null
          sent_at: string | null
          subject: string | null
        }
        Insert: {
          channel: Database["public"]["Enums"]["communication_channel"]
          clicked_at?: string | null
          company_id: string
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          delivered_at?: string | null
          direction?: string | null
          execution_id?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          opened_at?: string | null
          opportunity_id?: string | null
          replied_at?: string | null
          sent_at?: string | null
          subject?: string | null
        }
        Update: {
          channel?: Database["public"]["Enums"]["communication_channel"]
          clicked_at?: string | null
          company_id?: string
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          delivered_at?: string | null
          direction?: string | null
          execution_id?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          opened_at?: string | null
          opportunity_id?: string | null
          replied_at?: string | null
          sent_at?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_interactions_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "sequence_step_executions"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_templates: {
        Row: {
          channel: Database["public"]["Enums"]["communication_channel"]
          company_id: string
          content: string
          created_at: string | null
          created_by: string | null
          external_template_id: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string | null
          template_type: Database["public"]["Enums"]["template_type"] | null
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          channel: Database["public"]["Enums"]["communication_channel"]
          company_id: string
          content: string
          created_at?: string | null
          created_by?: string | null
          external_template_id?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject?: string | null
          template_type?: Database["public"]["Enums"]["template_type"] | null
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          channel?: Database["public"]["Enums"]["communication_channel"]
          company_id?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          external_template_id?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string | null
          template_type?: Database["public"]["Enums"]["template_type"] | null
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      communications: {
        Row: {
          company_id: string | null
          content: string | null
          created_at: string | null
          created_by: string | null
          direction: string | null
          id: string
          lead_id: string | null
          subject: string | null
          type: string
        }
        Insert: {
          company_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          direction?: string | null
          id?: string
          lead_id?: string | null
          subject?: string | null
          type: string
        }
        Update: {
          company_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          direction?: string | null
          id?: string
          lead_id?: string | null
          subject?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          cnpj: string | null
          created_at: string
          features: Json | null
          id: string
          max_leads: number | null
          max_users: number | null
          nome_fantasia: string
          plano: Database["public"]["Enums"]["company_plan"]
          razao_social: string | null
          status: Database["public"]["Enums"]["company_status"]
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          features?: Json | null
          id?: string
          max_leads?: number | null
          max_users?: number | null
          nome_fantasia: string
          plano?: Database["public"]["Enums"]["company_plan"]
          razao_social?: string | null
          status?: Database["public"]["Enums"]["company_status"]
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          features?: Json | null
          id?: string
          max_leads?: number | null
          max_users?: number | null
          nome_fantasia?: string
          plano?: Database["public"]["Enums"]["company_plan"]
          razao_social?: string | null
          status?: Database["public"]["Enums"]["company_status"]
          updated_at?: string
        }
        Relationships: []
      }
      custom_dashboards: {
        Row: {
          company_id: string
          created_at: string | null
          description: string | null
          filters: Json | null
          id: string
          is_active: boolean | null
          is_template: boolean | null
          layout: Json
          name: string
          sharing_config: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          description?: string | null
          filters?: Json | null
          id?: string
          is_active?: boolean | null
          is_template?: boolean | null
          layout?: Json
          name: string
          sharing_config?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          description?: string | null
          filters?: Json | null
          id?: string
          is_active?: boolean | null
          is_template?: boolean | null
          layout?: Json
          name?: string
          sharing_config?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_dashboards_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_fields: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          display_order: number | null
          field_label: string
          field_name: string
          field_options: Json | null
          field_type: string
          id: string
          is_active: boolean | null
          is_required: boolean | null
          module_type: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          display_order?: number | null
          field_label: string
          field_name: string
          field_options?: Json | null
          field_type: string
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          module_type: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          display_order?: number | null
          field_label?: string
          field_name?: string
          field_options?: Json | null
          field_type?: string
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          module_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      custom_flow_fields: {
        Row: {
          created_at: string
          display_order: number | null
          field_label: string
          field_name: string
          field_options: Json | null
          field_type: string
          flow_id: string
          id: string
          is_required: boolean | null
          stage_id: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          field_label: string
          field_name: string
          field_options?: Json | null
          field_type: string
          flow_id: string
          id?: string
          is_required?: boolean | null
          stage_id?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number | null
          field_label?: string
          field_name?: string
          field_options?: Json | null
          field_type?: string
          flow_id?: string
          id?: string
          is_required?: boolean | null
          stage_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_flow_fields_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "custom_flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_flow_fields_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "custom_flow_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_flow_items: {
        Row: {
          assigned_to: string | null
          cliente_id: string | null
          company_name: string | null
          contact_info: Json | null
          created_at: string
          created_by: string | null
          custom_data: Json | null
          data_entrada: string | null
          days_in_stage: number | null
          deal_status: string | null
          description: string | null
          due_date: string | null
          empresa: string | null
          flow_id: string
          id: string
          is_archived: boolean | null
          observacoes: string | null
          prioridade: string | null
          priority: string | null
          responsavel_id: string | null
          responsible_id: string | null
          stage_changed_at: string | null
          stage_id: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
          valor: number | null
          value: number | null
        }
        Insert: {
          assigned_to?: string | null
          cliente_id?: string | null
          company_name?: string | null
          contact_info?: Json | null
          created_at?: string
          created_by?: string | null
          custom_data?: Json | null
          data_entrada?: string | null
          days_in_stage?: number | null
          deal_status?: string | null
          description?: string | null
          due_date?: string | null
          empresa?: string | null
          flow_id: string
          id?: string
          is_archived?: boolean | null
          observacoes?: string | null
          prioridade?: string | null
          priority?: string | null
          responsavel_id?: string | null
          responsible_id?: string | null
          stage_changed_at?: string | null
          stage_id: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          valor?: number | null
          value?: number | null
        }
        Update: {
          assigned_to?: string | null
          cliente_id?: string | null
          company_name?: string | null
          contact_info?: Json | null
          created_at?: string
          created_by?: string | null
          custom_data?: Json | null
          data_entrada?: string | null
          days_in_stage?: number | null
          deal_status?: string | null
          description?: string | null
          due_date?: string | null
          empresa?: string | null
          flow_id?: string
          id?: string
          is_archived?: boolean | null
          observacoes?: string | null
          prioridade?: string | null
          priority?: string | null
          responsavel_id?: string | null
          responsible_id?: string | null
          stage_changed_at?: string | null
          stage_id?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          valor?: number | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_flow_items_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "custom_flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_flow_items_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "custom_flow_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_flow_stages: {
        Row: {
          automation_rules: Json | null
          color: string | null
          created_at: string
          description: string | null
          flow_id: string
          id: string
          is_active: boolean | null
          name: string
          stage_order: number
        }
        Insert: {
          automation_rules?: Json | null
          color?: string | null
          created_at?: string
          description?: string | null
          flow_id: string
          id?: string
          is_active?: boolean | null
          name: string
          stage_order: number
        }
        Update: {
          automation_rules?: Json | null
          color?: string | null
          created_at?: string
          description?: string | null
          flow_id?: string
          id?: string
          is_active?: boolean | null
          name?: string
          stage_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "custom_flow_stages_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "custom_flows"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_flows: {
        Row: {
          color: string | null
          company_id: string
          created_at: string
          created_by: string | null
          description: string | null
          flow_type: string
          icon: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          flow_type?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          flow_type?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      custom_metrics: {
        Row: {
          aggregation_type: string
          company_id: string
          created_at: string | null
          created_by: string
          data_sources: string[]
          description: string | null
          formula: Json
          id: string
          is_active: boolean | null
          name: string
          time_window: string | null
          updated_at: string | null
        }
        Insert: {
          aggregation_type: string
          company_id: string
          created_at?: string | null
          created_by: string
          data_sources: string[]
          description?: string | null
          formula: Json
          id?: string
          is_active?: boolean | null
          name: string
          time_window?: string | null
          updated_at?: string | null
        }
        Update: {
          aggregation_type?: string
          company_id?: string
          created_at?: string | null
          created_by?: string
          data_sources?: string[]
          description?: string | null
          formula?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          time_window?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_metrics_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_analytics: {
        Row: {
          action_data: Json | null
          action_type: string
          company_id: string
          created_at: string | null
          dashboard_id: string
          id: string
          session_id: string | null
          user_id: string
        }
        Insert: {
          action_data?: Json | null
          action_type: string
          company_id: string
          created_at?: string | null
          dashboard_id: string
          id?: string
          session_id?: string | null
          user_id: string
        }
        Update: {
          action_data?: Json | null
          action_type?: string
          company_id?: string
          created_at?: string | null
          dashboard_id?: string
          id?: string
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_analytics_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_analytics_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "custom_dashboards"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_templates: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          preview_image: string | null
          template_data: Json
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          preview_image?: string | null
          template_data: Json
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          preview_image?: string | null
          template_data?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      dashboard_widgets: {
        Row: {
          config: Json
          created_at: string | null
          dashboard_id: string
          data_query: Json
          id: string
          is_active: boolean | null
          position: Json
          title: string
          updated_at: string | null
          widget_type: string
        }
        Insert: {
          config?: Json
          created_at?: string | null
          dashboard_id: string
          data_query?: Json
          id?: string
          is_active?: boolean | null
          position?: Json
          title: string
          updated_at?: string | null
          widget_type: string
        }
        Update: {
          config?: Json
          created_at?: string | null
          dashboard_id?: string
          data_query?: Json
          id?: string
          is_active?: boolean | null
          position?: Json
          title?: string
          updated_at?: string | null
          widget_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_widgets_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "custom_dashboards"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_attachments: {
        Row: {
          company_id: string
          created_at: string | null
          deal_id: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          deal_id: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          deal_id?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_deal_attachments_deal_id"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "custom_flow_items"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_stage_responses: {
        Row: {
          created_at: string
          deal_id: string
          id: string
          question_id: string
          responded_by: string | null
          response_value: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deal_id: string
          id?: string
          question_id: string
          responded_by?: string | null
          response_value?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deal_id?: string
          id?: string
          question_id?: string
          responded_by?: string | null
          response_value?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_stage_responses_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "custom_flow_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_stage_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "flow_stage_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      default_risk_scores: {
        Row: {
          company_id: string
          created_at: string
          customer_document: string
          factors: Json
          id: string
          last_calculated_at: string
          risk_level: Database["public"]["Enums"]["default_risk_level"]
          risk_score: number
        }
        Insert: {
          company_id: string
          created_at?: string
          customer_document: string
          factors?: Json
          id?: string
          last_calculated_at?: string
          risk_level: Database["public"]["Enums"]["default_risk_level"]
          risk_score: number
        }
        Update: {
          company_id?: string
          created_at?: string
          customer_document?: string
          factors?: Json
          id?: string
          last_calculated_at?: string
          risk_level?: Database["public"]["Enums"]["default_risk_level"]
          risk_score?: number
        }
        Relationships: []
      }
      departments: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          manager_id: string | null
          name: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      derived_deals: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          parent_deal_id: string
          related_client: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          parent_deal_id: string
          related_client?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_deal_id?: string
          related_client?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_derived_deals_parent_deal_id"
            columns: ["parent_deal_id"]
            isOneToOne: false
            referencedRelation: "custom_flow_items"
            referencedColumns: ["id"]
          },
        ]
      }
      document_events: {
        Row: {
          company_id: string
          created_at: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          proposal_id: string
          user_agent: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          proposal_id: string
          user_agent?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          proposal_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_events_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          company_id: string
          content: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          template_type: string
          updated_at: string
          variables: string[]
        }
        Insert: {
          company_id: string
          content: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          template_type?: string
          updated_at?: string
          variables?: string[]
        }
        Update: {
          company_id?: string
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          template_type?: string
          updated_at?: string
          variables?: string[]
        }
        Relationships: []
      }
      employee_benefits: {
        Row: {
          amount: number
          benefit_type: Database["public"]["Enums"]["benefit_type"]
          company_id: string
          created_at: string
          description: string | null
          employee_id: string
          id: string
          payroll_id: string | null
        }
        Insert: {
          amount: number
          benefit_type: Database["public"]["Enums"]["benefit_type"]
          company_id: string
          created_at?: string
          description?: string | null
          employee_id: string
          id?: string
          payroll_id?: string | null
        }
        Update: {
          amount?: number
          benefit_type?: Database["public"]["Enums"]["benefit_type"]
          company_id?: string
          created_at?: string
          description?: string | null
          employee_id?: string
          id?: string
          payroll_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_benefits_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_benefits_payroll_id_fkey"
            columns: ["payroll_id"]
            isOneToOne: false
            referencedRelation: "payroll"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_deductions: {
        Row: {
          amount: number
          company_id: string
          created_at: string
          deduction_type: Database["public"]["Enums"]["deduction_type"]
          description: string | null
          employee_id: string
          id: string
          payroll_id: string | null
        }
        Insert: {
          amount: number
          company_id: string
          created_at?: string
          deduction_type: Database["public"]["Enums"]["deduction_type"]
          description?: string | null
          employee_id: string
          id?: string
          payroll_id?: string | null
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string
          deduction_type?: Database["public"]["Enums"]["deduction_type"]
          description?: string | null
          employee_id?: string
          id?: string
          payroll_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_deductions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_deductions_payroll_id_fkey"
            columns: ["payroll_id"]
            isOneToOne: false
            referencedRelation: "payroll"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_sequences: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          fallback_strategy: Json | null
          id: string
          is_active: boolean | null
          name: string
          sequence_steps: Json
          trigger_conditions: Json
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          fallback_strategy?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          sequence_steps?: Json
          trigger_conditions?: Json
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          fallback_strategy?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          sequence_steps?: Json
          trigger_conditions?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      external_apis: {
        Row: {
          auth_config: Json | null
          auth_type: string
          base_url: string
          company_id: string
          created_at: string | null
          headers: Json | null
          id: string
          is_active: boolean | null
          name: string
          rate_limit: Json | null
          type: string
          updated_at: string | null
        }
        Insert: {
          auth_config?: Json | null
          auth_type: string
          base_url: string
          company_id: string
          created_at?: string | null
          headers?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          rate_limit?: Json | null
          type: string
          updated_at?: string | null
        }
        Update: {
          auth_config?: Json | null
          auth_type?: string
          base_url?: string
          company_id?: string
          created_at?: string | null
          headers?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          rate_limit?: Json | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      external_forms: {
        Row: {
          company: string | null
          company_id: string | null
          created_at: string | null
          email: string
          form_data: Json | null
          form_name: string
          id: string
          message: string | null
          name: string
          phone: string | null
          submitted_at: string | null
        }
        Insert: {
          company?: string | null
          company_id?: string | null
          created_at?: string | null
          email: string
          form_data?: Json | null
          form_name: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          submitted_at?: string | null
        }
        Update: {
          company?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string
          form_data?: Json | null
          form_name?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "external_forms_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_accounts: {
        Row: {
          account_number: string | null
          account_type: string
          balance: number | null
          bank_name: string | null
          company_id: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          account_number?: string | null
          account_type: string
          balance?: number | null
          bank_name?: string | null
          company_id: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          account_number?: string | null
          account_type?: string
          balance?: number | null
          bank_name?: string | null
          company_id?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_categories: {
        Row: {
          category_type: string
          company_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          category_type: string
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          category_type?: string
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          account_id: string
          amount: number
          category_id: string | null
          company_id: string
          created_at: string
          created_by: string
          description: string
          id: string
          payment_method: string | null
          project_id: string | null
          reference: string | null
          status: string | null
          tags: string[] | null
          transaction_date: string
          transaction_type: string
          updated_at: string
        }
        Insert: {
          account_id: string
          amount: number
          category_id?: string | null
          company_id: string
          created_at?: string
          created_by: string
          description: string
          id?: string
          payment_method?: string | null
          project_id?: string | null
          reference?: string | null
          status?: string | null
          tags?: string[] | null
          transaction_date?: string
          transaction_type: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          amount?: number
          category_id?: string | null
          company_id?: string
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          payment_method?: string | null
          project_id?: string | null
          reference?: string | null
          status?: string | null
          tags?: string[] | null
          transaction_date?: string
          transaction_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "financial_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "financial_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_automations: {
        Row: {
          actions: Json
          created_at: string
          created_by: string | null
          flow_id: string
          id: string
          is_active: boolean | null
          name: string
          stage_id: string | null
          trigger_conditions: Json | null
          trigger_type: string
          updated_at: string
        }
        Insert: {
          actions: Json
          created_at?: string
          created_by?: string | null
          flow_id: string
          id?: string
          is_active?: boolean | null
          name: string
          stage_id?: string | null
          trigger_conditions?: Json | null
          trigger_type: string
          updated_at?: string
        }
        Update: {
          actions?: Json
          created_at?: string
          created_by?: string | null
          flow_id?: string
          id?: string
          is_active?: boolean | null
          name?: string
          stage_id?: string | null
          trigger_conditions?: Json | null
          trigger_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flow_automations_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "custom_flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flow_automations_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "custom_flow_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_item_history: {
        Row: {
          change_data: Json | null
          change_reason: string | null
          changed_by: string | null
          created_at: string
          from_stage_id: string | null
          id: string
          item_id: string
          to_stage_id: string | null
        }
        Insert: {
          change_data?: Json | null
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          from_stage_id?: string | null
          id?: string
          item_id: string
          to_stage_id?: string | null
        }
        Update: {
          change_data?: Json | null
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          from_stage_id?: string | null
          id?: string
          item_id?: string
          to_stage_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flow_item_history_from_stage_id_fkey"
            columns: ["from_stage_id"]
            isOneToOne: false
            referencedRelation: "custom_flow_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flow_item_history_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "custom_flow_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flow_item_history_to_stage_id_fkey"
            columns: ["to_stage_id"]
            isOneToOne: false
            referencedRelation: "custom_flow_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_stage_questions: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          display_order: number
          flow_stage_id: string
          id: string
          is_required: boolean
          options: Json | null
          question_text: string
          question_type: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          display_order?: number
          flow_stage_id: string
          id?: string
          is_required?: boolean
          options?: Json | null
          question_text: string
          question_type: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          display_order?: number
          flow_stage_id?: string
          id?: string
          is_required?: boolean
          options?: Json | null
          question_text?: string
          question_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flow_stage_questions_flow_stage_id_fkey"
            columns: ["flow_stage_id"]
            isOneToOne: false
            referencedRelation: "custom_flow_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      gamification_events: {
        Row: {
          company_id: string
          created_at: string | null
          description: string | null
          event_date: string | null
          event_type: Database["public"]["Enums"]["gamification_event_type"]
          id: string
          points: number
          reference_id: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          event_type: Database["public"]["Enums"]["gamification_event_type"]
          id?: string
          points: number
          reference_id?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          event_type?: Database["public"]["Enums"]["gamification_event_type"]
          id?: string
          points?: number
          reference_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gamification_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gamification_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gamification_rankings: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          period_end: string
          period_start: string
          ranking_position: number
          target_achievement_percentage: number | null
          total_deals: number
          total_points: number
          total_sales: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          period_end: string
          period_start: string
          ranking_position?: number
          target_achievement_percentage?: number | null
          total_deals?: number
          total_points?: number
          total_sales?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          period_end?: string
          period_start?: string
          ranking_position?: number
          target_achievement_percentage?: number | null
          total_deals?: number
          total_points?: number
          total_sales?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gamification_rankings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gamification_rankings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ia_agents: {
        Row: {
          company_id: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          user_id: string
          voice_id: string
          voice_language: string | null
          voice_name: string
          voice_settings: Json | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          user_id: string
          voice_id: string
          voice_language?: string | null
          voice_name: string
          voice_settings?: Json | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
          voice_id?: string
          voice_language?: string | null
          voice_name?: string
          voice_settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ia_agents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      ia_call_history: {
        Row: {
          action_description: string
          action_type: string
          call_id: string
          company_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action_description: string
          action_type: string
          call_id: string
          company_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action_description?: string
          action_type?: string
          call_id?: string
          company_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ia_call_history_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "ia_calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ia_call_history_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      ia_calls: {
        Row: {
          agent_id: string
          audio_base64: string | null
          audio_duration: number | null
          audio_url: string | null
          business_name: string | null
          call_type: string | null
          company_id: string
          created_at: string | null
          id: string
          lead_id: string | null
          lead_name: string
          status: string | null
          text_content: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_id: string
          audio_base64?: string | null
          audio_duration?: number | null
          audio_url?: string | null
          business_name?: string | null
          call_type?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          lead_id?: string | null
          lead_name: string
          status?: string | null
          text_content: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_id?: string
          audio_base64?: string | null
          audio_duration?: number | null
          audio_url?: string | null
          business_name?: string | null
          call_type?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          lead_id?: string | null
          lead_name?: string
          status?: string | null
          text_content?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ia_calls_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ia_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ia_calls_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      interactions: {
        Row: {
          company_id: string
          created_at: string | null
          custom_flow_item_id: string | null
          id: string
          interaction_date: string | null
          interaction_type: Database["public"]["Enums"]["task_type"]
          lead_id: string | null
          notes: string | null
          opportunity_id: string | null
          result: Database["public"]["Enums"]["interaction_result"] | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          custom_flow_item_id?: string | null
          id?: string
          interaction_date?: string | null
          interaction_type: Database["public"]["Enums"]["task_type"]
          lead_id?: string | null
          notes?: string | null
          opportunity_id?: string | null
          result?: Database["public"]["Enums"]["interaction_result"] | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          custom_flow_item_id?: string | null
          id?: string
          interaction_date?: string | null
          interaction_type?: Database["public"]["Enums"]["task_type"]
          lead_id?: string | null
          notes?: string | null
          opportunity_id?: string | null
          result?: Database["public"]["Enums"]["interaction_result"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_interactions_lead_id"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_interactions_opportunity_id"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_interactions_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_custom_flow_item_id_fkey"
            columns: ["custom_flow_item_id"]
            isOneToOne: false
            referencedRelation: "custom_flow_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_address: string | null
          client_document: string | null
          client_email: string | null
          client_name: string
          client_phone: string | null
          company_id: string
          created_at: string
          created_by: string
          discount_amount: number | null
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          net_amount: number
          notes: string | null
          payment_method: string | null
          status: string | null
          tax_amount: number | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          client_address?: string | null
          client_document?: string | null
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          company_id: string
          created_at?: string
          created_by: string
          discount_amount?: number | null
          due_date: string
          id?: string
          invoice_number: string
          issue_date?: string
          net_amount: number
          notes?: string | null
          payment_method?: string | null
          status?: string | null
          tax_amount?: number | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          client_address?: string | null
          client_document?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          company_id?: string
          created_at?: string
          created_by?: string
          discount_amount?: number | null
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          net_amount?: number
          notes?: string | null
          payment_method?: string | null
          status?: string | null
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      job_positions: {
        Row: {
          company_id: string
          created_at: string
          department_id: string | null
          description: string | null
          id: string
          job_type: Database["public"]["Enums"]["job_type"]
          salary_max: number | null
          salary_min: number | null
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          department_id?: string | null
          description?: string | null
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"]
          salary_max?: number | null
          salary_min?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          department_id?: string | null
          description?: string | null
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"]
          salary_max?: number | null
          salary_min?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_positions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      job_queue: {
        Row: {
          attempts: number | null
          company_id: string
          created_at: string | null
          error_message: string | null
          id: string
          job_type: string
          max_attempts: number | null
          payload: Json
          scheduled_at: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          attempts?: number | null
          company_id: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          job_type: string
          max_attempts?: number | null
          payload: Json
          scheduled_at: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          attempts?: number | null
          company_id?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          job_type?: string
          max_attempts?: number | null
          payload?: Json
          scheduled_at?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_queue_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_attribution: {
        Row: {
          attribution_model: string | null
          campaign_id: string | null
          conversion_date: string | null
          created_at: string | null
          first_touch_date: string | null
          id: string
          lead_id: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          attribution_model?: string | null
          campaign_id?: string | null
          conversion_date?: string | null
          created_at?: string | null
          first_touch_date?: string | null
          id?: string
          lead_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          attribution_model?: string | null
          campaign_id?: string | null
          conversion_date?: string | null
          created_at?: string | null
          first_touch_date?: string | null
          id?: string
          lead_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_attribution_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_custom_fields: {
        Row: {
          company_id: string
          created_at: string | null
          display_order: number | null
          field_label: string
          field_name: string
          field_type: string | null
          id: string
          is_required: boolean | null
          options: Json | null
          pipeline_stage_id: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          display_order?: number | null
          field_label: string
          field_name: string
          field_type?: string | null
          id?: string
          is_required?: boolean | null
          options?: Json | null
          pipeline_stage_id?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          display_order?: number | null
          field_label?: string
          field_name?: string
          field_type?: string | null
          id?: string
          is_required?: boolean | null
          options?: Json | null
          pipeline_stage_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_custom_fields_pipeline_stage_id_fkey"
            columns: ["pipeline_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_field_values: {
        Row: {
          created_at: string | null
          custom_field_id: string | null
          field_value: Json | null
          id: string
          lead_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_field_id?: string | null
          field_value?: Json | null
          id?: string
          lead_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_field_id?: string | null
          field_value?: Json | null
          id?: string
          lead_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_field_values_custom_field_id_fkey"
            columns: ["custom_field_id"]
            isOneToOne: false
            referencedRelation: "lead_custom_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_field_values_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_question_responses: {
        Row: {
          created_at: string | null
          id: string
          lead_id: string | null
          question_id: string | null
          responded_by: string | null
          response_value: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          question_id?: string | null
          responded_by?: string | null
          response_value?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          question_id?: string | null
          responded_by?: string | null
          response_value?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_question_responses_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_question_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "lead_stage_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_stage_questions: {
        Row: {
          company_id: string
          created_at: string | null
          display_order: number | null
          id: string
          is_required: boolean | null
          options: Json | null
          pipeline_stage_id: string | null
          question_text: string
          question_type: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_required?: boolean | null
          options?: Json | null
          pipeline_stage_id?: string | null
          question_text: string
          question_type?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_required?: boolean | null
          options?: Json | null
          pipeline_stage_id?: string | null
          question_text?: string
          question_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_stage_questions_pipeline_stage_id_fkey"
            columns: ["pipeline_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          address: string | null
          assigned_to: string | null
          auto_opportunity_created: boolean | null
          city: string | null
          company_id: string
          created_at: string | null
          created_by: string | null
          email: string | null
          energy_consumption: number | null
          facebook_click_id: string | null
          google_click_id: string | null
          id: string
          monthly_bill: number | null
          name: string
          notes: string | null
          phone: string | null
          rd_station_sent_at: string | null
          rd_station_sent_by: string | null
          rd_station_status: string | null
          roof_area: number | null
          source: string | null
          stage_id: string | null
          state: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
          system_size: number | null
          updated_at: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          whatsapp: string | null
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          assigned_to?: string | null
          auto_opportunity_created?: boolean | null
          city?: string | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          energy_consumption?: number | null
          facebook_click_id?: string | null
          google_click_id?: string | null
          id?: string
          monthly_bill?: number | null
          name: string
          notes?: string | null
          phone?: string | null
          rd_station_sent_at?: string | null
          rd_station_sent_by?: string | null
          rd_station_status?: string | null
          roof_area?: number | null
          source?: string | null
          stage_id?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          system_size?: number | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          whatsapp?: string | null
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          assigned_to?: string | null
          auto_opportunity_created?: boolean | null
          city?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          energy_consumption?: number | null
          facebook_click_id?: string | null
          google_click_id?: string | null
          id?: string
          monthly_bill?: number | null
          name?: string
          notes?: string | null
          phone?: string | null
          rd_station_sent_at?: string | null
          rd_station_sent_by?: string | null
          rd_station_status?: string | null
          roof_area?: number | null
          source?: string | null
          stage_id?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          system_size?: number | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          whatsapp?: string | null
          zipcode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      mentions: {
        Row: {
          comment_id: string
          company_id: string
          created_at: string
          id: string
          mentioned_user_id: string
          notification_id: string | null
        }
        Insert: {
          comment_id: string
          company_id: string
          created_at?: string
          id?: string
          mentioned_user_id: string
          notification_id?: string | null
        }
        Update: {
          comment_id?: string
          company_id?: string
          created_at?: string
          id?: string
          mentioned_user_id?: string
          notification_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentions_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      message_deliveries: {
        Row: {
          channel: string
          company_id: string
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          external_id: string | null
          id: string
          read_at: string | null
          sequence_enrollment_id: string | null
          status: string
        }
        Insert: {
          channel: string
          company_id: string
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          read_at?: string | null
          sequence_enrollment_id?: string | null
          status: string
        }
        Update: {
          channel?: string
          company_id?: string
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          read_at?: string | null
          sequence_enrollment_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_deliveries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_deliveries_sequence_enrollment_id_fkey"
            columns: ["sequence_enrollment_id"]
            isOneToOne: false
            referencedRelation: "sequence_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      mk_analytics_campaigns: {
        Row: {
          bounce_rate: number | null
          campaign_id: string
          campaign_name: string
          campaign_type: string | null
          click_rate: number | null
          company_id: string
          created_at: string | null
          delivery_rate: number | null
          id: string
          open_rate: number | null
          status: string | null
          total_bounced: number | null
          total_clicked: number | null
          total_delivered: number | null
          total_opened: number | null
          total_sent: number | null
          total_unsubscribed: number | null
          unsubscribe_rate: number | null
          updated_at: string | null
        }
        Insert: {
          bounce_rate?: number | null
          campaign_id: string
          campaign_name: string
          campaign_type?: string | null
          click_rate?: number | null
          company_id: string
          created_at?: string | null
          delivery_rate?: number | null
          id?: string
          open_rate?: number | null
          status?: string | null
          total_bounced?: number | null
          total_clicked?: number | null
          total_delivered?: number | null
          total_opened?: number | null
          total_sent?: number | null
          total_unsubscribed?: number | null
          unsubscribe_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          bounce_rate?: number | null
          campaign_id?: string
          campaign_name?: string
          campaign_type?: string | null
          click_rate?: number | null
          company_id?: string
          created_at?: string | null
          delivery_rate?: number | null
          id?: string
          open_rate?: number | null
          status?: string | null
          total_bounced?: number | null
          total_clicked?: number | null
          total_delivered?: number | null
          total_opened?: number | null
          total_sent?: number | null
          total_unsubscribed?: number | null
          unsubscribe_rate?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mk_analytics_dashboards: {
        Row: {
          company_id: string
          config: Json
          created_at: string | null
          created_by: string
          description: string | null
          filters: Json
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          config?: Json
          created_at?: string | null
          created_by: string
          description?: string | null
          filters?: Json
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          config?: Json
          created_at?: string | null
          created_by?: string
          description?: string | null
          filters?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mk_analytics_data: {
        Row: {
          additional_data: Json | null
          company_id: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          metric_date: string
          metric_name: string
          metric_value: number
        }
        Insert: {
          additional_data?: Json | null
          company_id: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          metric_date: string
          metric_name: string
          metric_value: number
        }
        Update: {
          additional_data?: Json | null
          company_id?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          metric_date?: string
          metric_name?: string
          metric_value?: number
        }
        Relationships: []
      }
      mk_analytics_email_metrics: {
        Row: {
          bounce_reason: string | null
          bounced_at: string | null
          campaign_id: string | null
          campaign_name: string
          clicked_at: string | null
          company_id: string
          created_at: string | null
          delivered_at: string | null
          email_address: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          opened_at: string | null
          sent_at: string | null
          unsubscribed_at: string | null
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          bounce_reason?: string | null
          bounced_at?: string | null
          campaign_id?: string | null
          campaign_name: string
          clicked_at?: string | null
          company_id: string
          created_at?: string | null
          delivered_at?: string | null
          email_address: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          opened_at?: string | null
          sent_at?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          bounce_reason?: string | null
          bounced_at?: string | null
          campaign_id?: string | null
          campaign_name?: string
          clicked_at?: string | null
          company_id?: string
          created_at?: string | null
          delivered_at?: string | null
          email_address?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          opened_at?: string | null
          sent_at?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      mk_analytics_previews: {
        Row: {
          campaign_id: string
          company_id: string
          created_at: string | null
          created_by: string
          id: string
          preview_data: Json
          published_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          company_id: string
          created_at?: string | null
          created_by: string
          id?: string
          preview_data?: Json
          published_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          company_id?: string
          created_at?: string | null
          created_by?: string
          id?: string
          preview_data?: Json
          published_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mk_cadence_enrollments: {
        Row: {
          completed_at: string | null
          context_data: Json | null
          current_step: number | null
          email: string
          enrolled_at: string | null
          exit_reason: string | null
          flow_id: string | null
          id: string
          lead_id: string | null
          opportunity_id: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          context_data?: Json | null
          current_step?: number | null
          email: string
          enrolled_at?: string | null
          exit_reason?: string | null
          flow_id?: string | null
          id?: string
          lead_id?: string | null
          opportunity_id?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          context_data?: Json | null
          current_step?: number | null
          email?: string
          enrolled_at?: string | null
          exit_reason?: string | null
          flow_id?: string | null
          id?: string
          lead_id?: string | null
          opportunity_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mk_cadence_enrollments_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "mk_cadence_flows"
            referencedColumns: ["id"]
          },
        ]
      }
      mk_cadence_flows: {
        Row: {
          company_id: string
          completion_rate: number | null
          created_at: string | null
          created_by: string
          description: string | null
          flow_config: Json | null
          id: string
          is_active: boolean | null
          name: string
          total_enrolled: number | null
          trigger_conditions: Json | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          completion_rate?: number | null
          created_at?: string | null
          created_by: string
          description?: string | null
          flow_config?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          total_enrolled?: number | null
          trigger_conditions?: Json | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          completion_rate?: number | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          flow_config?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          total_enrolled?: number | null
          trigger_conditions?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mk_cadence_steps: {
        Row: {
          conditions: Json | null
          content: string | null
          created_at: string | null
          delay_days: number | null
          delay_hours: number | null
          email_template_id: string | null
          flow_id: string | null
          id: string
          is_active: boolean | null
          name: string
          step_order: number
          step_type: string
          subject: string | null
          webhook_url: string | null
        }
        Insert: {
          conditions?: Json | null
          content?: string | null
          created_at?: string | null
          delay_days?: number | null
          delay_hours?: number | null
          email_template_id?: string | null
          flow_id?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          step_order: number
          step_type: string
          subject?: string | null
          webhook_url?: string | null
        }
        Update: {
          conditions?: Json | null
          content?: string | null
          created_at?: string | null
          delay_days?: number | null
          delay_hours?: number | null
          email_template_id?: string | null
          flow_id?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          step_order?: number
          step_type?: string
          subject?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mk_cadence_steps_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "mk_cadence_flows"
            referencedColumns: ["id"]
          },
        ]
      }
      mk_dispatch_sends: {
        Row: {
          clicks_count: number | null
          company_id: string
          created_at: string | null
          delivered_at: string | null
          dispatch_id: string
          error_code: string | null
          error_message: string | null
          failed_at: string | null
          id: string
          last_clicked_at: string | null
          last_opened_at: string | null
          lead_id: string | null
          opens_count: number | null
          opportunity_id: string | null
          processed_content: string | null
          processed_subject: string | null
          provider_message_id: string | null
          provider_response: Json | null
          recipient_email: string
          recipient_name: string | null
          scheduled_at: string | null
          sent_at: string | null
          status: string
          variables_used: Json | null
        }
        Insert: {
          clicks_count?: number | null
          company_id: string
          created_at?: string | null
          delivered_at?: string | null
          dispatch_id: string
          error_code?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          last_clicked_at?: string | null
          last_opened_at?: string | null
          lead_id?: string | null
          opens_count?: number | null
          opportunity_id?: string | null
          processed_content?: string | null
          processed_subject?: string | null
          provider_message_id?: string | null
          provider_response?: Json | null
          recipient_email: string
          recipient_name?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          variables_used?: Json | null
        }
        Update: {
          clicks_count?: number | null
          company_id?: string
          created_at?: string | null
          delivered_at?: string | null
          dispatch_id?: string
          error_code?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          last_clicked_at?: string | null
          last_opened_at?: string | null
          lead_id?: string | null
          opens_count?: number | null
          opportunity_id?: string | null
          processed_content?: string | null
          processed_subject?: string | null
          provider_message_id?: string | null
          provider_response?: Json | null
          recipient_email?: string
          recipient_name?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          variables_used?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "mk_dispatch_sends_dispatch_id_fkey"
            columns: ["dispatch_id"]
            isOneToOne: false
            referencedRelation: "mk_email_dispatches"
            referencedColumns: ["id"]
          },
        ]
      }
      mk_editor_email_templates: {
        Row: {
          company_id: string
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          company_id: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          company_id?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      mk_editor_email_variables: {
        Row: {
          category: string
          company_id: string
          created_at: string | null
          data_type: string
          default_value: string | null
          description: string | null
          display_name: string
          id: string
          is_active: boolean | null
          is_system: boolean | null
          updated_at: string | null
          variable_key: string
        }
        Insert: {
          category?: string
          company_id: string
          created_at?: string | null
          data_type?: string
          default_value?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          updated_at?: string | null
          variable_key: string
        }
        Update: {
          category?: string
          company_id?: string
          created_at?: string | null
          data_type?: string
          default_value?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          updated_at?: string | null
          variable_key?: string
        }
        Relationships: []
      }
      mk_email_campaigns: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string
          description: string | null
          from_email: string
          from_name: string
          id: string
          name: string
          reply_to: string | null
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          subject_line: string
          template_id: string | null
          total_recipients: number | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          from_email: string
          from_name: string
          id?: string
          name: string
          reply_to?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject_line: string
          template_id?: string | null
          total_recipients?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          from_email?: string
          from_name?: string
          id?: string
          name?: string
          reply_to?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject_line?: string
          template_id?: string | null
          total_recipients?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mk_email_dispatches: {
        Row: {
          company_id: string
          completed_at: string | null
          content: string
          created_at: string | null
          created_by: string | null
          dispatch_type: string
          failed_count: number | null
          id: string
          name: string
          notes: string | null
          priority: string | null
          processed_content: string | null
          recipients: Json
          scheduled_at: string | null
          sender_email: string | null
          sender_name: string | null
          sent_count: number | null
          started_at: string | null
          status: string
          subject: string
          tags: string[] | null
          target_filters: Json | null
          template_id: string | null
          total_recipients: number | null
          updated_at: string | null
          variables_config: Json | null
        }
        Insert: {
          company_id: string
          completed_at?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          dispatch_type?: string
          failed_count?: number | null
          id?: string
          name: string
          notes?: string | null
          priority?: string | null
          processed_content?: string | null
          recipients?: Json
          scheduled_at?: string | null
          sender_email?: string | null
          sender_name?: string | null
          sent_count?: number | null
          started_at?: string | null
          status?: string
          subject: string
          tags?: string[] | null
          target_filters?: Json | null
          template_id?: string | null
          total_recipients?: number | null
          updated_at?: string | null
          variables_config?: Json | null
        }
        Update: {
          company_id?: string
          completed_at?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          dispatch_type?: string
          failed_count?: number | null
          id?: string
          name?: string
          notes?: string | null
          priority?: string | null
          processed_content?: string | null
          recipients?: Json
          scheduled_at?: string | null
          sender_email?: string | null
          sender_name?: string | null
          sent_count?: number | null
          started_at?: string | null
          status?: string
          subject?: string
          tags?: string[] | null
          target_filters?: Json | null
          template_id?: string | null
          total_recipients?: number | null
          updated_at?: string | null
          variables_config?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "mk_email_dispatches_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "mk_email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      mk_email_marketing_variables: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string | null
          default_value: string | null
          description: string | null
          display_name: string
          id: string
          is_active: boolean | null
          is_system: boolean | null
          updated_at: string | null
          variable_key: string
          variable_type: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by?: string | null
          default_value?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          updated_at?: string | null
          variable_key: string
          variable_type?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          default_value?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          updated_at?: string | null
          variable_key?: string
          variable_type?: string | null
        }
        Relationships: []
      }
      mk_email_sends: {
        Row: {
          bounce_reason: string | null
          bounced_at: string | null
          campaign_id: string | null
          click_count: number | null
          clicked_at: string | null
          created_at: string | null
          delivered_at: string | null
          email: string
          id: string
          ip_address: unknown | null
          lead_id: string | null
          open_count: number | null
          opened_at: string | null
          opportunity_id: string | null
          sent_at: string | null
          status: string | null
          unsubscribed_at: string | null
          user_agent: string | null
        }
        Insert: {
          bounce_reason?: string | null
          bounced_at?: string | null
          campaign_id?: string | null
          click_count?: number | null
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          email: string
          id?: string
          ip_address?: unknown | null
          lead_id?: string | null
          open_count?: number | null
          opened_at?: string | null
          opportunity_id?: string | null
          sent_at?: string | null
          status?: string | null
          unsubscribed_at?: string | null
          user_agent?: string | null
        }
        Update: {
          bounce_reason?: string | null
          bounced_at?: string | null
          campaign_id?: string | null
          click_count?: number | null
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          email?: string
          id?: string
          ip_address?: unknown | null
          lead_id?: string | null
          open_count?: number | null
          opened_at?: string | null
          opportunity_id?: string | null
          sent_at?: string | null
          status?: string | null
          unsubscribed_at?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mk_email_sends_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "mk_email_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      mk_email_templates: {
        Row: {
          category: string | null
          company_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          html_content: string
          id: string
          is_active: boolean | null
          is_system_template: boolean | null
          json_design: Json | null
          name: string
          subject: string | null
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          category?: string | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          html_content: string
          id?: string
          is_active?: boolean | null
          is_system_template?: boolean | null
          json_design?: Json | null
          name: string
          subject?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          category?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          html_content?: string
          id?: string
          is_active?: boolean | null
          is_system_template?: boolean | null
          json_design?: Json | null
          name?: string
          subject?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      mk_email_variables: {
        Row: {
          category: string
          column_source: string
          company_id: string
          created_at: string | null
          data_type: string
          default_value: string | null
          description: string | null
          display_name: string
          format_config: Json | null
          id: string
          is_active: boolean | null
          is_system: boolean | null
          table_source: string
          updated_at: string | null
          variable_key: string
        }
        Insert: {
          category: string
          column_source: string
          company_id: string
          created_at?: string | null
          data_type?: string
          default_value?: string | null
          description?: string | null
          display_name: string
          format_config?: Json | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          table_source: string
          updated_at?: string | null
          variable_key: string
        }
        Update: {
          category?: string
          column_source?: string
          company_id?: string
          created_at?: string | null
          data_type?: string
          default_value?: string | null
          description?: string | null
          display_name?: string
          format_config?: Json | null
          id?: string
          is_active?: boolean | null
          is_system?: boolean | null
          table_source?: string
          updated_at?: string | null
          variable_key?: string
        }
        Relationships: []
      }
      mk_form_submissions: {
        Row: {
          converted_to_lead: boolean | null
          created_at: string | null
          email: string
          form_data: Json
          id: string
          ip_address: unknown | null
          landing_page_id: string | null
          lead_id: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          converted_to_lead?: boolean | null
          created_at?: string | null
          email: string
          form_data: Json
          id?: string
          ip_address?: unknown | null
          landing_page_id?: string | null
          lead_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          converted_to_lead?: boolean | null
          created_at?: string | null
          email?: string
          form_data?: Json
          id?: string
          ip_address?: unknown | null
          landing_page_id?: string | null
          lead_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mk_form_submissions_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "mk_landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      mk_landing_pages: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string
          css_styles: string | null
          description: string | null
          domain: string | null
          form_config: Json | null
          html_content: string
          id: string
          is_published: boolean | null
          json_design: Json | null
          name: string
          seo_config: Json | null
          slug: string
          title: string | null
          total_conversions: number | null
          total_views: number | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by: string
          css_styles?: string | null
          description?: string | null
          domain?: string | null
          form_config?: Json | null
          html_content: string
          id?: string
          is_published?: boolean | null
          json_design?: Json | null
          name: string
          seo_config?: Json | null
          slug: string
          title?: string | null
          total_conversions?: number | null
          total_views?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string
          css_styles?: string | null
          description?: string | null
          domain?: string | null
          form_config?: Json | null
          html_content?: string
          id?: string
          is_published?: boolean | null
          json_design?: Json | null
          name?: string
          seo_config?: Json | null
          slug?: string
          title?: string | null
          total_conversions?: number | null
          total_views?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mk_lead_scoring: {
        Row: {
          behavior_score: number | null
          company_id: string
          created_at: string | null
          email_score: number | null
          engagement_score: number | null
          id: string
          last_activity_at: string | null
          lead_id: string
          score_history: Json | null
          score_level: string | null
          total_score: number | null
          updated_at: string | null
        }
        Insert: {
          behavior_score?: number | null
          company_id: string
          created_at?: string | null
          email_score?: number | null
          engagement_score?: number | null
          id?: string
          last_activity_at?: string | null
          lead_id: string
          score_history?: Json | null
          score_level?: string | null
          total_score?: number | null
          updated_at?: string | null
        }
        Update: {
          behavior_score?: number | null
          company_id?: string
          created_at?: string | null
          email_score?: number | null
          engagement_score?: number | null
          id?: string
          last_activity_at?: string | null
          lead_id?: string
          score_history?: Json | null
          score_level?: string | null
          total_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mk_marketing_settings: {
        Row: {
          ab_test_enabled: boolean | null
          auto_enroll_leads: boolean | null
          auto_update_scores: boolean | null
          business_hours_only: boolean | null
          company_id: string
          created_at: string | null
          created_by: string | null
          cross_platform_tracking: boolean | null
          decay_days_since_contact: number | null
          decay_enabled: boolean | null
          decay_percentage: number | null
          deliverability_mode: string | null
          email_campaign_results: boolean | null
          enable_lead_scoring: boolean | null
          id: string
          integration_errors: boolean | null
          max_daily_emails: number | null
          optimize_delivery: boolean | null
          pause_on_replies: boolean | null
          prevent_duplicates: boolean | null
          real_time_alerts: boolean | null
          score_threshold_cold: number | null
          score_threshold_hot: number | null
          score_threshold_warm: number | null
          sequence_completed: boolean | null
          share_conversions: boolean | null
          smart_send_times: boolean | null
          smart_sequencing: boolean | null
          sync_lead_data: boolean | null
          unified_reporting: boolean | null
          updated_at: string | null
          weekly_reports: boolean | null
        }
        Insert: {
          ab_test_enabled?: boolean | null
          auto_enroll_leads?: boolean | null
          auto_update_scores?: boolean | null
          business_hours_only?: boolean | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          cross_platform_tracking?: boolean | null
          decay_days_since_contact?: number | null
          decay_enabled?: boolean | null
          decay_percentage?: number | null
          deliverability_mode?: string | null
          email_campaign_results?: boolean | null
          enable_lead_scoring?: boolean | null
          id?: string
          integration_errors?: boolean | null
          max_daily_emails?: number | null
          optimize_delivery?: boolean | null
          pause_on_replies?: boolean | null
          prevent_duplicates?: boolean | null
          real_time_alerts?: boolean | null
          score_threshold_cold?: number | null
          score_threshold_hot?: number | null
          score_threshold_warm?: number | null
          sequence_completed?: boolean | null
          share_conversions?: boolean | null
          smart_send_times?: boolean | null
          smart_sequencing?: boolean | null
          sync_lead_data?: boolean | null
          unified_reporting?: boolean | null
          updated_at?: string | null
          weekly_reports?: boolean | null
        }
        Update: {
          ab_test_enabled?: boolean | null
          auto_enroll_leads?: boolean | null
          auto_update_scores?: boolean | null
          business_hours_only?: boolean | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          cross_platform_tracking?: boolean | null
          decay_days_since_contact?: number | null
          decay_enabled?: boolean | null
          decay_percentage?: number | null
          deliverability_mode?: string | null
          email_campaign_results?: boolean | null
          enable_lead_scoring?: boolean | null
          id?: string
          integration_errors?: boolean | null
          max_daily_emails?: number | null
          optimize_delivery?: boolean | null
          pause_on_replies?: boolean | null
          prevent_duplicates?: boolean | null
          real_time_alerts?: boolean | null
          score_threshold_cold?: number | null
          score_threshold_hot?: number | null
          score_threshold_warm?: number | null
          sequence_completed?: boolean | null
          share_conversions?: boolean | null
          smart_send_times?: boolean | null
          smart_sequencing?: boolean | null
          sync_lead_data?: boolean | null
          unified_reporting?: boolean | null
          updated_at?: string | null
          weekly_reports?: boolean | null
        }
        Relationships: []
      }
      monitor_activity_metrics: {
        Row: {
          company_id: string
          created_at: string | null
          date: string
          department_id: string | null
          id: string
          metrics: Json
          performance_score: number | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          date?: string
          department_id?: string | null
          id?: string
          metrics?: Json
          performance_score?: number | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          date?: string
          department_id?: string | null
          id?: string
          metrics?: Json
          performance_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monitor_activity_metrics_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "access_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monitor_activity_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      monitor_user_sessions: {
        Row: {
          company_id: string
          current_action: string | null
          current_module: string | null
          department_id: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          session_end: string | null
          session_start: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          current_action?: string | null
          current_module?: string | null
          department_id?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_end?: string | null
          session_start?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          current_action?: string | null
          current_module?: string | null
          department_id?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_end?: string | null
          session_start?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monitor_user_sessions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "access_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monitor_user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          company_id: string
          content: string
          created_at: string
          id: string
          is_read: boolean
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          assigned_to: string | null
          automation_rules: string | null
          company_id: string
          contact_id: string | null
          counter_id: string | null
          created_at: string | null
          created_by: string | null
          custom_id: string | null
          days_remaining: number | null
          description: string | null
          expected_close_date: string | null
          id: string
          lead_id: string | null
          lead_score: number | null
          observations: string | null
          probability: number | null
          score_factors: Json | null
          stage: Database["public"]["Enums"]["opportunity_stage"] | null
          structure_type: string | null
          title: string
          updated_at: string | null
          value: number | null
          win_probability: number | null
        }
        Insert: {
          assigned_to?: string | null
          automation_rules?: string | null
          company_id: string
          contact_id?: string | null
          counter_id?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_id?: string | null
          days_remaining?: number | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          lead_id?: string | null
          lead_score?: number | null
          observations?: string | null
          probability?: number | null
          score_factors?: Json | null
          stage?: Database["public"]["Enums"]["opportunity_stage"] | null
          structure_type?: string | null
          title: string
          updated_at?: string | null
          value?: number | null
          win_probability?: number | null
        }
        Update: {
          assigned_to?: string | null
          automation_rules?: string | null
          company_id?: string
          contact_id?: string | null
          counter_id?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_id?: string | null
          days_remaining?: number | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          lead_id?: string | null
          lead_score?: number | null
          observations?: string | null
          probability?: number | null
          score_factors?: Json | null
          stage?: Database["public"]["Enums"]["opportunity_stage"] | null
          structure_type?: string | null
          title?: string
          updated_at?: string | null
          value?: number | null
          win_probability?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_checklists: {
        Row: {
          checklist_data: Json
          company_id: string
          completion_status: Json | null
          created_at: string | null
          id: string
          opportunity_id: string
          template_id: string
          updated_at: string | null
        }
        Insert: {
          checklist_data?: Json
          company_id: string
          completion_status?: Json | null
          created_at?: string | null
          id?: string
          opportunity_id: string
          template_id: string
          updated_at?: string | null
        }
        Update: {
          checklist_data?: Json
          company_id?: string
          completion_status?: Json | null
          created_at?: string | null
          id?: string
          opportunity_id?: string
          template_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_checklists_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_checklists_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_tag_relations: {
        Row: {
          created_at: string | null
          id: string
          opportunity_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          opportunity_id: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          opportunity_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_tag_relations_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_tag_relations_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "opportunity_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_tags: {
        Row: {
          color: string | null
          company_id: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_collections: {
        Row: {
          account_receivable_id: string
          amount: number
          boleto_code: string | null
          collection_type: string
          company_id: string
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          metadata: Json | null
          payment_link: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          pix_qr_code: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["collection_status"]
          updated_at: string
        }
        Insert: {
          account_receivable_id: string
          amount: number
          boleto_code?: string | null
          collection_type?: string
          company_id: string
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          payment_link?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          pix_qr_code?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["collection_status"]
          updated_at?: string
        }
        Update: {
          account_receivable_id?: string
          amount?: number
          boleto_code?: string | null
          collection_type?: string
          company_id?: string
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          payment_link?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          pix_qr_code?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["collection_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_collections_account_receivable_id_fkey"
            columns: ["account_receivable_id"]
            isOneToOne: false
            referencedRelation: "accounts_receivable"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_integrations: {
        Row: {
          api_key_encrypted: string | null
          company_id: string
          config: Json
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          is_sandbox: boolean
          provider: string
          updated_at: string
        }
        Insert: {
          api_key_encrypted?: string | null
          company_id: string
          config?: Json
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean
          is_sandbox?: boolean
          provider: string
          updated_at?: string
        }
        Update: {
          api_key_encrypted?: string | null
          company_id?: string
          config?: Json
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          is_sandbox?: boolean
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_reminders: {
        Row: {
          account_receivable_id: string
          attempt_number: number
          company_id: string
          created_at: string
          id: string
          message: string
          reminder_type: Database["public"]["Enums"]["reminder_type"]
          response_data: Json | null
          scheduled_at: string
          sent_at: string | null
          status: string
          subject: string | null
        }
        Insert: {
          account_receivable_id: string
          attempt_number?: number
          company_id: string
          created_at?: string
          id?: string
          message: string
          reminder_type: Database["public"]["Enums"]["reminder_type"]
          response_data?: Json | null
          scheduled_at: string
          sent_at?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          account_receivable_id?: string
          attempt_number?: number
          company_id?: string
          created_at?: string
          id?: string
          message?: string
          reminder_type?: Database["public"]["Enums"]["reminder_type"]
          response_data?: Json | null
          scheduled_at?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_reminders_account_receivable_id_fkey"
            columns: ["account_receivable_id"]
            isOneToOne: false
            referencedRelation: "accounts_receivable"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          account_id: string
          amount: number
          company_id: string
          created_at: string
          created_by: string
          description: string
          id: string
          invoice_id: string | null
          payment_date: string
          payment_method: string
          payment_type: string
          reference: string | null
          status: string | null
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          account_id: string
          amount: number
          company_id: string
          created_at?: string
          created_by: string
          description: string
          id?: string
          invoice_id?: string | null
          payment_date?: string
          payment_method: string
          payment_type: string
          reference?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          amount?: number
          company_id?: string
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          invoice_id?: string | null
          payment_date?: string
          payment_method?: string
          payment_type?: string
          reference?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "financial_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "financial_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll: {
        Row: {
          base_salary: number
          bonus_amount: number | null
          company_id: string
          created_at: string
          employee_id: string
          gross_salary: number
          id: string
          net_salary: number
          overtime_amount: number | null
          processed_at: string | null
          processed_by: string | null
          reference_month: number
          reference_year: number
          total_benefits: number | null
          total_deductions: number | null
          updated_at: string
        }
        Insert: {
          base_salary: number
          bonus_amount?: number | null
          company_id: string
          created_at?: string
          employee_id: string
          gross_salary: number
          id?: string
          net_salary: number
          overtime_amount?: number | null
          processed_at?: string | null
          processed_by?: string | null
          reference_month: number
          reference_year: number
          total_benefits?: number | null
          total_deductions?: number | null
          updated_at?: string
        }
        Update: {
          base_salary?: number
          bonus_amount?: number | null
          company_id?: string
          created_at?: string
          employee_id?: string
          gross_salary?: number
          id?: string
          net_salary?: number
          overtime_amount?: number | null
          processed_at?: string | null
          processed_by?: string | null
          reference_month?: number
          reference_year?: number
          total_benefits?: number | null
          total_deductions?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payslips: {
        Row: {
          company_id: string
          created_at: string
          employee_id: string
          generated_at: string | null
          id: string
          payroll_id: string
          pdf_url: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          employee_id: string
          generated_at?: string | null
          id?: string
          payroll_id: string
          pdf_url?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          employee_id?: string
          generated_at?: string | null
          id?: string
          payroll_id?: string
          pdf_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payslips_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payslips_payroll_id_fkey"
            columns: ["payroll_id"]
            isOneToOne: false
            referencedRelation: "payroll"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_actions: {
        Row: {
          automation_step_id: string
          created_at: string | null
          error_message: string | null
          executado_em: string | null
          id: string
          lead_id: string | null
          opportunity_id: string | null
          retries: number | null
          scheduled_at: string
          status: string | null
        }
        Insert: {
          automation_step_id: string
          created_at?: string | null
          error_message?: string | null
          executado_em?: string | null
          id?: string
          lead_id?: string | null
          opportunity_id?: string | null
          retries?: number | null
          scheduled_at: string
          status?: string | null
        }
        Update: {
          automation_step_id?: string
          created_at?: string | null
          error_message?: string | null
          executado_em?: string | null
          id?: string
          lead_id?: string | null
          opportunity_id?: string | null
          retries?: number | null
          scheduled_at?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pending_actions_lead"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pending_actions_opportunity"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pending_actions_automation_step_id_fkey"
            columns: ["automation_step_id"]
            isOneToOne: false
            referencedRelation: "automation_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          automation_rules: Json | null
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          pipeline_id: string
          probability: number | null
          stage_order: number
          updated_at: string | null
        }
        Insert: {
          automation_rules?: Json | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          pipeline_id: string
          probability?: number | null
          stage_order: number
          updated_at?: string | null
        }
        Update: {
          automation_rules?: Json | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          pipeline_id?: string
          probability?: number | null
          stage_order?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_stages_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      pipelines: {
        Row: {
          category: string | null
          company_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pipelines_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      plugin_execution_logs: {
        Row: {
          company_id: string
          entity_id: string | null
          entity_type: string
          error_message: string | null
          event_type: string
          executed_at: string | null
          execution_data: Json | null
          id: string
          plugin_id: string | null
          success: boolean | null
        }
        Insert: {
          company_id: string
          entity_id?: string | null
          entity_type: string
          error_message?: string | null
          event_type: string
          executed_at?: string | null
          execution_data?: Json | null
          id?: string
          plugin_id?: string | null
          success?: boolean | null
        }
        Update: {
          company_id?: string
          entity_id?: string | null
          entity_type?: string
          error_message?: string | null
          event_type?: string
          executed_at?: string | null
          execution_data?: Json | null
          id?: string
          plugin_id?: string | null
          success?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "plugin_execution_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plugin_execution_logs_plugin_id_fkey"
            columns: ["plugin_id"]
            isOneToOne: false
            referencedRelation: "plugin_registry"
            referencedColumns: ["id"]
          },
        ]
      }
      plugin_registry: {
        Row: {
          company_id: string
          configuration: Json | null
          created_by: string | null
          id: string
          installed_at: string | null
          is_enabled: boolean | null
          last_updated: string | null
          plugin_name: string
          plugin_version: string
        }
        Insert: {
          company_id: string
          configuration?: Json | null
          created_by?: string | null
          id?: string
          installed_at?: string | null
          is_enabled?: boolean | null
          last_updated?: string | null
          plugin_name: string
          plugin_version: string
        }
        Update: {
          company_id?: string
          configuration?: Json | null
          created_by?: string | null
          id?: string
          installed_at?: string | null
          is_enabled?: boolean | null
          last_updated?: string | null
          plugin_name?: string
          plugin_version?: string
        }
        Relationships: [
          {
            foreignKeyName: "plugin_registry_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      prediction_logs: {
        Row: {
          actual_outcome: string | null
          company_id: string
          confidence: number | null
          feature_importance: Json | null
          id: string
          input_features: Json
          model_id: string
          opportunity_id: string
          outcome_date: string | null
          predicted_probability: number
          prediction_date: string | null
        }
        Insert: {
          actual_outcome?: string | null
          company_id: string
          confidence?: number | null
          feature_importance?: Json | null
          id?: string
          input_features: Json
          model_id: string
          opportunity_id: string
          outcome_date?: string | null
          predicted_probability: number
          prediction_date?: string | null
        }
        Update: {
          actual_outcome?: string | null
          company_id?: string
          confidence?: number | null
          feature_importance?: Json | null
          id?: string
          input_features?: Json
          model_id?: string
          opportunity_id?: string
          outcome_date?: string | null
          predicted_probability?: number
          prediction_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prediction_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prediction_logs_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "prediction_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prediction_logs_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      prediction_models: {
        Row: {
          accuracy: number | null
          company_id: string
          created_at: string | null
          created_by: string | null
          features: Json
          id: string
          is_active: boolean
          metrics: Json
          model_type: string
          name: string
          training_data_count: number
          updated_at: string | null
          version: string
        }
        Insert: {
          accuracy?: number | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          metrics?: Json
          model_type?: string
          name: string
          training_data_count?: number
          updated_at?: string | null
          version: string
        }
        Update: {
          accuracy?: number | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          metrics?: Json
          model_type?: string
          name?: string
          training_data_count?: number
          updated_at?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "prediction_models_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          channel: string | null
          company_id: string
          id: string
          new_price: number | null
          old_price: number | null
          product_id: string
          reason: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          channel?: string | null
          company_id: string
          id?: string
          new_price?: number | null
          old_price?: number | null
          product_id: string
          reason?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          channel?: string | null
          company_id?: string
          id?: string
          new_price?: number | null
          old_price?: number | null
          product_id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          company_id: string
          conditions: Json
          created_at: string | null
          created_by: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          name: string
          priority: number | null
          rule_type: string
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          company_id: string
          conditions: Json
          created_at?: string | null
          created_by?: string | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          name: string
          priority?: number | null
          rule_type: string
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          company_id?: string
          conditions?: Json
          created_at?: string | null
          created_by?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          name?: string
          priority?: number | null
          rule_type?: string
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      product_approvals: {
        Row: {
          company_id: string
          created_at: string | null
          decision_by: string | null
          decision_reason: string | null
          id: string
          product_id: string
          proposed_by: string
          proposed_price: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          decision_by?: string | null
          decision_reason?: string | null
          id?: string
          product_id: string
          proposed_by: string
          proposed_price: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          decision_by?: string | null
          decision_reason?: string | null
          id?: string
          product_id?: string
          proposed_by?: string
          proposed_price?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_approvals_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_bundles: {
        Row: {
          bundle_discount_type: string | null
          bundle_discount_value: number | null
          company_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          products_config: Json
          updated_at: string | null
        }
        Insert: {
          bundle_discount_type?: string | null
          bundle_discount_value?: number | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          products_config: Json
          updated_at?: string | null
        }
        Update: {
          bundle_discount_type?: string | null
          bundle_discount_value?: number | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          products_config?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_bundles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      product_pricing_rules: {
        Row: {
          admin_fixed_fee: number | null
          channel: string | null
          cofins_percent: number | null
          company_id: string
          created_at: string | null
          gateway_percent: number | null
          icms_percent: number | null
          id: string
          iss_percent: number | null
          margin_target_percent: number | null
          marketplace_percent: number | null
          markup_percent: number | null
          mode: string | null
          pis_percent: number | null
          product_id: string | null
          rounding: string | null
          rounding_decimals: number | null
          rounding_ending: string | null
          sales_commission_percent: number | null
          target_price: number | null
          tax_burden_percent: number | null
          updated_at: string | null
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          admin_fixed_fee?: number | null
          channel?: string | null
          cofins_percent?: number | null
          company_id: string
          created_at?: string | null
          gateway_percent?: number | null
          icms_percent?: number | null
          id?: string
          iss_percent?: number | null
          margin_target_percent?: number | null
          marketplace_percent?: number | null
          markup_percent?: number | null
          mode?: string | null
          pis_percent?: number | null
          product_id?: string | null
          rounding?: string | null
          rounding_decimals?: number | null
          rounding_ending?: string | null
          sales_commission_percent?: number | null
          target_price?: number | null
          tax_burden_percent?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          admin_fixed_fee?: number | null
          channel?: string | null
          cofins_percent?: number | null
          company_id?: string
          created_at?: string | null
          gateway_percent?: number | null
          icms_percent?: number | null
          id?: string
          iss_percent?: number | null
          margin_target_percent?: number | null
          marketplace_percent?: number | null
          markup_percent?: number | null
          mode?: string | null
          pis_percent?: number | null
          product_id?: string | null
          rounding?: string | null
          rounding_decimals?: number | null
          rounding_ending?: string | null
          sales_commission_percent?: number | null
          target_price?: number | null
          tax_burden_percent?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_pricing_rules_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          brand: string | null
          category: string
          company_id: string
          cost_base: number
          cost_price: number | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          current_stock: number | null
          description: string | null
          ean: string | null
          freight_unit_cost: number | null
          id: string
          is_active: boolean | null
          is_configurable: boolean | null
          max_stock: number | null
          min_stock: number | null
          name: string
          ncm: string | null
          other_variable_cost: number | null
          packaging_unit_cost: number | null
          price_current: number | null
          price_suggested: number | null
          sku: string | null
          status: string | null
          tax_rate: number | null
          technical_specs: Json | null
          unit: string
          unit_type: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          category: string
          company_id: string
          cost_base: number
          cost_price?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          current_stock?: number | null
          description?: string | null
          ean?: string | null
          freight_unit_cost?: number | null
          id?: string
          is_active?: boolean | null
          is_configurable?: boolean | null
          max_stock?: number | null
          min_stock?: number | null
          name: string
          ncm?: string | null
          other_variable_cost?: number | null
          packaging_unit_cost?: number | null
          price_current?: number | null
          price_suggested?: number | null
          sku?: string | null
          status?: string | null
          tax_rate?: number | null
          technical_specs?: Json | null
          unit?: string
          unit_type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          category?: string
          company_id?: string
          cost_base?: number
          cost_price?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          current_stock?: number | null
          description?: string | null
          ean?: string | null
          freight_unit_cost?: number | null
          id?: string
          is_active?: boolean | null
          is_configurable?: boolean | null
          max_stock?: number | null
          min_stock?: number | null
          name?: string
          ncm?: string | null
          other_variable_cost?: number | null
          packaging_unit_cost?: number | null
          price_current?: number | null
          price_suggested?: number | null
          sku?: string | null
          status?: string | null
          tax_rate?: number | null
          technical_specs?: Json | null
          unit?: string
          unit_type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          birth_date: string | null
          cargo: string | null
          company_id: string | null
          cpf: string | null
          created_at: string | null
          department_id: string | null
          email: string
          employee_id: string | null
          employee_status: Database["public"]["Enums"]["employee_status"] | null
          full_name: string
          hire_date: string | null
          id: string
          is_company_admin: boolean | null
          job_position_id: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          role_id: string | null
          salary: number | null
          termination_date: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          cargo?: string | null
          company_id?: string | null
          cpf?: string | null
          created_at?: string | null
          department_id?: string | null
          email: string
          employee_id?: string | null
          employee_status?:
            | Database["public"]["Enums"]["employee_status"]
            | null
          full_name: string
          hire_date?: string | null
          id: string
          is_company_admin?: boolean | null
          job_position_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          role_id?: string | null
          salary?: number | null
          termination_date?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          cargo?: string | null
          company_id?: string | null
          cpf?: string | null
          created_at?: string | null
          department_id?: string | null
          email?: string
          employee_id?: string | null
          employee_status?:
            | Database["public"]["Enums"]["employee_status"]
            | null
          full_name?: string
          hire_date?: string | null
          id?: string
          is_company_admin?: boolean | null
          job_position_id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          role_id?: string | null
          salary?: number | null
          termination_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_job_position_id_fkey"
            columns: ["job_position_id"]
            isOneToOne: false
            referencedRelation: "job_positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_budgets: {
        Row: {
          actual_amount: number
          budget_type: string
          category_id: string | null
          company_id: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          planned_amount: number
          project_id: string
          updated_at: string
        }
        Insert: {
          actual_amount?: number
          budget_type: string
          category_id?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          planned_amount?: number
          project_id: string
          updated_at?: string
        }
        Update: {
          actual_amount?: number
          budget_type?: string
          category_id?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          planned_amount?: number
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_budgets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "financial_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_budgets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          added_at: string
          added_by: string
          can_assign_tasks: boolean | null
          can_edit: boolean | null
          id: string
          project_id: string
          role: string
          user_id: string
        }
        Insert: {
          added_at?: string
          added_by: string
          can_assign_tasks?: boolean | null
          can_edit?: boolean | null
          id?: string
          project_id: string
          role?: string
          user_id: string
        }
        Update: {
          added_at?: string
          added_by?: string
          can_assign_tasks?: boolean | null
          can_edit?: boolean | null
          id?: string
          project_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          order_index: number | null
          parent_task_id: string | null
          priority: Database["public"]["Enums"]["task_priority"]
          progress: number | null
          project_id: string
          start_date: string | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          order_index?: number | null
          parent_task_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          progress?: number | null
          project_id: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          order_index?: number | null
          parent_task_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          progress?: number | null
          project_id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          company_id: string
          created_at: string
          created_by: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          priority: Database["public"]["Enums"]["project_priority"]
          progress: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          budget?: number | null
          company_id: string
          created_at?: string
          created_by: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          priority?: Database["public"]["Enums"]["project_priority"]
          progress?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          budget?: number | null
          company_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          priority?: Database["public"]["Enums"]["project_priority"]
          progress?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: []
      }
      proposal_items: {
        Row: {
          bundle_id: string | null
          created_at: string | null
          custom_description: string | null
          discount_amount: number | null
          discount_percentage: number | null
          id: string
          item_type: string
          product_id: string | null
          proposal_id: string
          quantity: number
          tax_amount: number | null
          technical_specs: Json | null
          total_amount: number
          unit_price: number
        }
        Insert: {
          bundle_id?: string | null
          created_at?: string | null
          custom_description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          item_type: string
          product_id?: string | null
          proposal_id: string
          quantity?: number
          tax_amount?: number | null
          technical_specs?: Json | null
          total_amount: number
          unit_price: number
        }
        Update: {
          bundle_id?: string | null
          created_at?: string | null
          custom_description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          item_type?: string
          product_id?: string | null
          proposal_id?: string
          quantity?: number
          tax_amount?: number | null
          technical_specs?: Json | null
          total_amount?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposal_items_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "product_bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposal_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposal_items_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_templates: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          template_content: Json
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          template_content: Json
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          template_content?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposal_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_word_templates: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          file_name: string
          file_url: string
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          updated_at: string | null
          variables_detected: string[] | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_name: string
          file_url: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          updated_at?: string | null
          variables_detected?: string[] | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          file_name?: string
          file_url?: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
          variables_detected?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "proposal_word_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          approval_required: boolean | null
          approved_at: string | null
          approved_by: string | null
          company_id: string
          content: Json | null
          created_at: string | null
          created_by: string | null
          deal_id: string | null
          discount_amount: number | null
          discount_percentage: number | null
          id: string
          last_viewed_at: string | null
          lead_id: string | null
          opportunity_id: string | null
          payment_terms: string | null
          pdf_url: string | null
          revision_count: number | null
          signature_url: string | null
          signed_at: string | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          template_id: string | null
          template_used: string | null
          terms_conditions: string | null
          title: string
          total_value: number | null
          tracking_token: string | null
          updated_at: string | null
          valid_until: string | null
          version: number | null
          view_count: number | null
          word_template_id: string | null
        }
        Insert: {
          approval_required?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          company_id: string
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          deal_id?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          last_viewed_at?: string | null
          lead_id?: string | null
          opportunity_id?: string | null
          payment_terms?: string | null
          pdf_url?: string | null
          revision_count?: number | null
          signature_url?: string | null
          signed_at?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          template_id?: string | null
          template_used?: string | null
          terms_conditions?: string | null
          title: string
          total_value?: number | null
          tracking_token?: string | null
          updated_at?: string | null
          valid_until?: string | null
          version?: number | null
          view_count?: number | null
          word_template_id?: string | null
        }
        Update: {
          approval_required?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          company_id?: string
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          deal_id?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          last_viewed_at?: string | null
          lead_id?: string | null
          opportunity_id?: string | null
          payment_terms?: string | null
          pdf_url?: string | null
          revision_count?: number | null
          signature_url?: string | null
          signed_at?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          template_id?: string | null
          template_used?: string | null
          terms_conditions?: string | null
          title?: string
          total_value?: number | null
          tracking_token?: string | null
          updated_at?: string | null
          valid_until?: string | null
          version?: number | null
          view_count?: number | null
          word_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "custom_flow_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "proposal_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_word_template_id_fkey"
            columns: ["word_template_id"]
            isOneToOne: false
            referencedRelation: "proposal_word_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          id: string
          product_id: string
          purchase_order_id: string
          quantity: number
          received_quantity: number | null
          total_price: number
          unit_price: number
        }
        Insert: {
          id?: string
          product_id: string
          purchase_order_id: string
          quantity: number
          received_quantity?: number | null
          total_price: number
          unit_price: number
        }
        Update: {
          id?: string
          product_id?: string
          purchase_order_id?: string
          quantity?: number
          received_quantity?: number | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          company_id: string
          created_at: string
          created_by: string
          expected_date: string | null
          id: string
          notes: string | null
          po_number: string
          status: string
          supplier_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by: string
          expected_date?: string | null
          id?: string
          notes?: string | null
          po_number: string
          status?: string
          supplier_id: string
          total_amount?: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string
          expected_date?: string | null
          id?: string
          notes?: string | null
          po_number?: string
          status?: string
          supplier_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      rls_performance_logs: {
        Row: {
          company_id: string | null
          created_at: string | null
          execution_time_ms: number | null
          id: string
          policy_name: string
          query_type: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          execution_time_ms?: number | null
          id?: string
          policy_name: string
          query_type?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          execution_time_ms?: number | null
          id?: string
          policy_name?: string
          query_type?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      sales_achievements: {
        Row: {
          commission_amount: number
          commission_rate: number
          company_id: string
          created_at: string | null
          id: string
          margin_amount: number | null
          opportunity_id: string
          proposal_id: string | null
          sale_amount: number
          sale_date: string
          target_percentage: number
          user_id: string
        }
        Insert: {
          commission_amount: number
          commission_rate: number
          company_id: string
          created_at?: string | null
          id?: string
          margin_amount?: number | null
          opportunity_id: string
          proposal_id?: string | null
          sale_amount: number
          sale_date: string
          target_percentage: number
          user_id: string
        }
        Update: {
          commission_amount?: number
          commission_rate?: number
          company_id?: string
          created_at?: string | null
          id?: string
          margin_amount?: number | null
          opportunity_id?: string
          proposal_id?: string | null
          sale_amount?: number
          sale_date?: string
          target_percentage?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_achievements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_achievements_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_achievements_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_activities: {
        Row: {
          activity_date: string | null
          activity_type: string
          company_id: string | null
          created_at: string | null
          description: string | null
          id: string
          lead_id: string | null
          opportunity_id: string | null
          user_id: string | null
        }
        Insert: {
          activity_date?: string | null
          activity_type: string
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          lead_id?: string | null
          opportunity_id?: string | null
          user_id?: string | null
        }
        Update: {
          activity_date?: string | null
          activity_type?: string
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          lead_id?: string | null
          opportunity_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_activities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_targets: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          target_period_end: string
          target_period_start: string
          target_type: string | null
          target_value: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          target_period_end: string
          target_period_start: string
          target_type?: string | null
          target_value: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          target_period_end?: string
          target_period_start?: string
          target_type?: string | null
          target_value?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_targets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_targets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scoring_rules: {
        Row: {
          company_id: string
          conditions: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          points: number
          updated_at: string | null
        }
        Insert: {
          company_id: string
          conditions: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          points: number
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          conditions?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          points?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scoring_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      sequence_enrollments: {
        Row: {
          company_id: string
          completed_at: string | null
          context_data: Json | null
          current_step: number | null
          enrolled_at: string | null
          enrollment_status:
            | Database["public"]["Enums"]["sequence_enrollment_status"]
            | null
          exit_reason: string | null
          id: string
          lead_id: string | null
          opportunity_id: string | null
          sequence_id: string
        }
        Insert: {
          company_id: string
          completed_at?: string | null
          context_data?: Json | null
          current_step?: number | null
          enrolled_at?: string | null
          enrollment_status?:
            | Database["public"]["Enums"]["sequence_enrollment_status"]
            | null
          exit_reason?: string | null
          id?: string
          lead_id?: string | null
          opportunity_id?: string | null
          sequence_id: string
        }
        Update: {
          company_id?: string
          completed_at?: string | null
          context_data?: Json | null
          current_step?: number | null
          enrolled_at?: string | null
          enrollment_status?:
            | Database["public"]["Enums"]["sequence_enrollment_status"]
            | null
          exit_reason?: string | null
          id?: string
          lead_id?: string | null
          opportunity_id?: string | null
          sequence_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sequence_enrollments_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "engagement_sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      sequence_step_executions: {
        Row: {
          channel: Database["public"]["Enums"]["communication_channel"]
          created_at: string | null
          delivery_status: Json | null
          engagement_data: Json | null
          enrollment_id: string
          error_message: string | null
          executed_at: string | null
          id: string
          scheduled_at: string | null
          status: string | null
          step_index: number
          template_id: string | null
        }
        Insert: {
          channel: Database["public"]["Enums"]["communication_channel"]
          created_at?: string | null
          delivery_status?: Json | null
          engagement_data?: Json | null
          enrollment_id: string
          error_message?: string | null
          executed_at?: string | null
          id?: string
          scheduled_at?: string | null
          status?: string | null
          step_index: number
          template_id?: string | null
        }
        Update: {
          channel?: Database["public"]["Enums"]["communication_channel"]
          created_at?: string | null
          delivery_status?: Json | null
          engagement_data?: Json | null
          enrollment_id?: string
          error_message?: string | null
          executed_at?: string | null
          id?: string
          scheduled_at?: string | null
          status?: string | null
          step_index?: number
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sequence_step_executions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "sequence_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequence_step_executions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "communication_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_requests: {
        Row: {
          company_id: string
          created_at: string | null
          external_signature_id: string | null
          id: string
          proposal_id: string
          signed_at: string | null
          signers: Json
          status: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          external_signature_id?: string | null
          id?: string
          proposal_id: string
          signed_at?: string | null
          signers: Json
          status?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          external_signature_id?: string | null
          id?: string
          proposal_id?: string
          signed_at?: string | null
          signers?: Json
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signature_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signature_requests_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      sla_configs: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          priority: Database["public"]["Enums"]["ticket_priority"]
          resolution_time_hours: number
          response_time_hours: number
          ticket_type: Database["public"]["Enums"]["ticket_type"]
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          priority: Database["public"]["Enums"]["ticket_priority"]
          resolution_time_hours: number
          response_time_hours: number
          ticket_type: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolution_time_hours?: number
          response_time_hours?: number
          ticket_type?: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      solar_calculations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          inputs: Json
          lead_id: string | null
          pdf_generated: boolean | null
          proposal_id: string | null
          results: Json
          shared_via_link: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          inputs: Json
          lead_id?: string | null
          pdf_generated?: boolean | null
          proposal_id?: string | null
          results: Json
          shared_via_link?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          inputs?: Json
          lead_id?: string | null
          pdf_generated?: boolean | null
          proposal_id?: string | null
          results?: Json
          shared_via_link?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "solar_calculations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solar_calculations_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      solar_equipment: {
        Row: {
          brand: string
          created_at: string
          efficiency: number | null
          id: string
          is_active: boolean | null
          model: string
          power_rating: number
          price_per_kw: number
          type: string
          updated_at: string
          warranty_years: number | null
        }
        Insert: {
          brand: string
          created_at?: string
          efficiency?: number | null
          id?: string
          is_active?: boolean | null
          model: string
          power_rating: number
          price_per_kw: number
          type: string
          updated_at?: string
          warranty_years?: number | null
        }
        Update: {
          brand?: string
          created_at?: string
          efficiency?: number | null
          id?: string
          is_active?: boolean | null
          model?: string
          power_rating?: number
          price_per_kw?: number
          type?: string
          updated_at?: string
          warranty_years?: number | null
        }
        Relationships: []
      }
      solar_hsp_data: {
        Row: {
          city: string | null
          created_at: string
          hsp_value: number
          id: string
          latitude: number | null
          longitude: number | null
          state: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          hsp_value: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          state: string
        }
        Update: {
          city?: string | null
          created_at?: string
          hsp_value?: number
          id?: string
          latitude?: number | null
          longitude?: number | null
          state?: string
        }
        Relationships: []
      }
      stage_automations: {
        Row: {
          actions: Json
          company_id: string
          created_at: string
          created_by: string | null
          description: string | null
          execution_count: number | null
          flow_id: string
          id: string
          is_active: boolean
          name: string
          stage_id: string
          success_rate: number | null
          trigger: Json
          updated_at: string
        }
        Insert: {
          actions?: Json
          company_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          execution_count?: number | null
          flow_id: string
          id?: string
          is_active?: boolean
          name: string
          stage_id: string
          success_rate?: number | null
          trigger?: Json
          updated_at?: string
        }
        Update: {
          actions?: Json
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          execution_count?: number | null
          flow_id?: string
          id?: string
          is_active?: boolean
          name?: string
          stage_id?: string
          success_rate?: number | null
          trigger?: Json
          updated_at?: string
        }
        Relationships: []
      }
      stock_alerts: {
        Row: {
          alert_type: string
          company_id: string
          created_at: string
          id: string
          is_active: boolean
          product_id: string
        }
        Insert: {
          alert_type: string
          company_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          product_id: string
        }
        Update: {
          alert_type?: string
          company_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          company_id: string
          created_at: string
          created_by: string
          id: string
          movement_type: string
          notes: string | null
          product_id: string
          quantity: number
          reference_id: string | null
          reference_type: string | null
          unit_cost: number | null
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by: string
          id?: string
          movement_type: string
          notes?: string | null
          product_id: string
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          unit_cost?: number | null
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string
          id?: string
          movement_type?: string
          notes?: string | null
          product_id?: string
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          cnpj: string | null
          company_id: string
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          cnpj?: string | null
          company_id: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          cnpj?: string | null
          company_id?: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_agents: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          max_concurrent_tickets: number | null
          specialties: Database["public"]["Enums"]["ticket_type"][] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_concurrent_tickets?: number | null
          specialties?: Database["public"]["Enums"]["ticket_type"][] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_concurrent_tickets?: number | null
          specialties?: Database["public"]["Enums"]["ticket_type"][] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      support_ticket_interactions: {
        Row: {
          attachments: Json | null
          company_id: string
          created_at: string | null
          id: string
          is_internal: boolean | null
          message: string
          ticket_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          company_id: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message: string
          ticket_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attachments?: Json | null
          company_id?: string
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message?: string
          ticket_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          can_reopen: boolean | null
          client_id: string | null
          company_id: string
          created_at: string | null
          created_by: string
          description: string | null
          evaluated_at: string | null
          evaluation_comment: string | null
          evaluation_rating: number | null
          first_response_at: string | null
          id: string
          is_internal: boolean
          opportunity_id: string | null
          priority: Database["public"]["Enums"]["ticket_priority"]
          reopened_count: number | null
          resolved_at: string | null
          sla_deadline: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: Database["public"]["Enums"]["ticket_subject"]
          ticket_number: number
          title: string
          type: Database["public"]["Enums"]["ticket_type"]
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          can_reopen?: boolean | null
          client_id?: string | null
          company_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          evaluated_at?: string | null
          evaluation_comment?: string | null
          evaluation_rating?: number | null
          first_response_at?: string | null
          id?: string
          is_internal?: boolean
          opportunity_id?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"]
          reopened_count?: number | null
          resolved_at?: string | null
          sla_deadline?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: Database["public"]["Enums"]["ticket_subject"]
          ticket_number?: number
          title: string
          type: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          can_reopen?: boolean | null
          client_id?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          evaluated_at?: string | null
          evaluation_comment?: string | null
          evaluation_rating?: number | null
          first_response_at?: string | null
          id?: string
          is_internal?: boolean
          opportunity_id?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"]
          reopened_count?: number | null
          resolved_at?: string | null
          sla_deadline?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: Database["public"]["Enums"]["ticket_subject"]
          ticket_number?: number
          title?: string
          type?: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_support_tickets_assigned_to"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_support_tickets_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_support_tickets_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_support_tickets_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_support_tickets_opportunity"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      system_integrations: {
        Row: {
          api_key_reference: string | null
          company_id: string
          config: Json | null
          created_at: string
          created_by: string | null
          id: string
          integration_name: string
          integration_type: string
          is_active: boolean | null
          last_sync_at: string | null
          sync_status: string | null
          updated_at: string
        }
        Insert: {
          api_key_reference?: string | null
          company_id: string
          config?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          integration_name: string
          integration_type: string
          is_active?: boolean | null
          last_sync_at?: string | null
          sync_status?: string | null
          updated_at?: string
        }
        Update: {
          api_key_reference?: string | null
          company_id?: string
          config?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          integration_name?: string
          integration_type?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          sync_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          auto_follow_up: boolean
          auto_lead_assignment: boolean
          auto_task_creation: boolean
          company_id: string
          company_name: string
          created_at: string
          email_notifications: boolean
          id: string
          language: string
          password_expiration: number
          push_notifications: boolean
          session_timeout: number
          sms_notifications: boolean
          timezone: string
          two_factor_auth: boolean
          updated_at: string
        }
        Insert: {
          auto_follow_up?: boolean
          auto_lead_assignment?: boolean
          auto_task_creation?: boolean
          company_id: string
          company_name?: string
          created_at?: string
          email_notifications?: boolean
          id?: string
          language?: string
          password_expiration?: number
          push_notifications?: boolean
          session_timeout?: number
          sms_notifications?: boolean
          timezone?: string
          two_factor_auth?: boolean
          updated_at?: string
        }
        Update: {
          auto_follow_up?: boolean
          auto_lead_assignment?: boolean
          auto_task_creation?: boolean
          company_id?: string
          company_name?: string
          created_at?: string
          email_notifications?: boolean
          id?: string
          language?: string
          password_expiration?: number
          push_notifications?: boolean
          session_timeout?: number
          sms_notifications?: boolean
          timezone?: string
          two_factor_auth?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      task_dependencies: {
        Row: {
          created_at: string
          dependency_type: string | null
          depends_on_task_id: string
          id: string
          task_id: string
        }
        Insert: {
          created_at?: string
          dependency_type?: string | null
          depends_on_task_id: string
          id?: string
          task_id: string
        }
        Update: {
          created_at?: string
          dependency_type?: string | null
          depends_on_task_id?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_dependencies_depends_on_task_id_fkey"
            columns: ["depends_on_task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_template_steps: {
        Row: {
          created_at: string | null
          days_offset: number
          description: string | null
          id: string
          order_index: number
          priority: Database["public"]["Enums"]["task_priority"] | null
          task_type: Database["public"]["Enums"]["task_type"]
          template_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          days_offset: number
          description?: string | null
          id?: string
          order_index: number
          priority?: Database["public"]["Enums"]["task_priority"] | null
          task_type: Database["public"]["Enums"]["task_type"]
          template_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          days_offset?: number
          description?: string | null
          id?: string
          order_index?: number
          priority?: Database["public"]["Enums"]["task_priority"] | null
          task_type?: Database["public"]["Enums"]["task_type"]
          template_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_template_steps_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "task_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      task_templates: {
        Row: {
          company_id: string
          created_at: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      task_types: {
        Row: {
          color: string | null
          company_id: string
          created_at: string
          created_by: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          is_system: boolean
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          company_id: string
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          custom_task_type: string | null
          delegated_by: string | null
          delegation_level: string | null
          description: string | null
          due_date: string | null
          id: string
          interaction_id: string | null
          lead_id: string | null
          opportunity_id: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          task_category: string | null
          task_type: Database["public"]["Enums"]["task_type"] | null
          template_step_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          company_id: string
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_task_type?: string | null
          delegated_by?: string | null
          delegation_level?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          interaction_id?: string | null
          lead_id?: string | null
          opportunity_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          task_category?: string | null
          task_type?: Database["public"]["Enums"]["task_type"] | null
          template_step_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          company_id?: string
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_task_type?: string | null
          delegated_by?: string | null
          delegation_level?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          interaction_id?: string | null
          lead_id?: string | null
          opportunity_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          task_category?: string | null
          task_type?: Database["public"]["Enums"]["task_type"] | null
          template_step_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_custom_task_type_fkey"
            columns: ["custom_task_type"]
            isOneToOne: false
            referencedRelation: "task_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_interaction_id_fkey"
            columns: ["interaction_id"]
            isOneToOne: false
            referencedRelation: "interactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_template_step_id_fkey"
            columns: ["template_step_id"]
            isOneToOne: false
            referencedRelation: "task_template_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          company_id: string
          created_at: string
          gerente_id: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          gerente_id?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          gerente_id?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      ticket_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          interaction_id: string | null
          ticket_id: string | null
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          interaction_id?: string | null
          ticket_id?: string | null
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          interaction_id?: string | null
          ticket_id?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_attachments_interaction_id_fkey"
            columns: ["interaction_id"]
            isOneToOne: false
            referencedRelation: "ticket_interactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_interactions: {
        Row: {
          content: string
          created_at: string | null
          id: string
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          is_internal: boolean | null
          is_system: boolean | null
          ticket_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          interaction_type?: Database["public"]["Enums"]["interaction_type"]
          is_internal?: boolean | null
          is_system?: boolean | null
          ticket_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          interaction_type?: Database["public"]["Enums"]["interaction_type"]
          is_internal?: boolean | null
          is_system?: boolean | null
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_interactions_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      time_tracking: {
        Row: {
          break_end: string | null
          break_start: string | null
          clock_in: string | null
          clock_out: string | null
          company_id: string
          created_at: string
          date: string
          employee_id: string
          id: string
          notes: string | null
          overtime_hours: number | null
          updated_at: string
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          clock_in?: string | null
          clock_out?: string | null
          company_id: string
          created_at?: string
          date: string
          employee_id: string
          id?: string
          notes?: string | null
          overtime_hours?: number | null
          updated_at?: string
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          clock_in?: string | null
          clock_out?: string | null
          company_id?: string
          created_at?: string
          date?: string
          employee_id?: string
          id?: string
          notes?: string | null
          overtime_hours?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_tracking_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string | null
          deal_id: string
          description: string | null
          event_date: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by?: string | null
          deal_id: string
          description?: string | null
          event_date?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          deal_id?: string
          description?: string | null
          event_date?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_timeline_events_deal_id"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "custom_flow_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_discount_limits: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          max_discount_percentage: number
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          max_discount_percentage: number
          role: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          max_discount_percentage?: number
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_discount_limits_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string | null
          deals_target: number | null
          id: string
          period_end: string
          period_start: string
          sales_target: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by?: string | null
          deals_target?: number | null
          id?: string
          period_end: string
          period_start: string
          sales_target?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          deals_target?: number | null
          id?: string
          period_end?: string
          period_start?: string
          sales_target?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_goals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_hierarchy: {
        Row: {
          created_at: string | null
          id: string
          manager_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          manager_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          manager_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_hierarchy_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_hierarchy_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invites: {
        Row: {
          accepted_at: string | null
          company_id: string
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role_id: string | null
          status: string | null
          team_id: string | null
          token: string
        }
        Insert: {
          accepted_at?: string | null
          company_id: string
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          role_id?: string | null
          status?: string | null
          team_id?: string | null
          token: string
        }
        Update: {
          accepted_at?: string | null
          company_id?: string
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role_id?: string | null
          status?: string | null
          team_id?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_invites_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invites_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invites_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      user_ote_config: {
        Row: {
          base_salary: number
          company_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          monthly_target: number
          target_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          base_salary: number
          company_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          monthly_target: number
          target_type?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          base_salary?: number
          company_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          monthly_target?: number
          target_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_ote_config_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_ote_config_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          company_id: string
          created_at: string | null
          created_by: string | null
          id: string
          is_system_default: boolean | null
          name: string
          permissions: Json
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_system_default?: boolean | null
          name: string
          permissions?: Json
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_system_default?: boolean | null
          name?: string
          permissions?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_deliveries: {
        Row: {
          attempts: number | null
          company_id: string
          created_at: string | null
          event_type: string
          id: string
          last_attempt_at: string | null
          payload: Json
          response_body: string | null
          response_status: number | null
          status: string | null
          webhook_endpoint_id: string
        }
        Insert: {
          attempts?: number | null
          company_id: string
          created_at?: string | null
          event_type: string
          id?: string
          last_attempt_at?: string | null
          payload: Json
          response_body?: string | null
          response_status?: number | null
          status?: string | null
          webhook_endpoint_id: string
        }
        Update: {
          attempts?: number | null
          company_id?: string
          created_at?: string | null
          event_type?: string
          id?: string
          last_attempt_at?: string | null
          payload?: Json
          response_body?: string | null
          response_status?: number | null
          status?: string | null
          webhook_endpoint_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_deliveries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_deliveries_webhook_endpoint_id_fkey"
            columns: ["webhook_endpoint_id"]
            isOneToOne: false
            referencedRelation: "webhook_endpoints"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_endpoints: {
        Row: {
          company_id: string
          created_at: string | null
          events: string[]
          id: string
          is_active: boolean | null
          name: string
          secret: string
          updated_at: string | null
          url: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          events: string[]
          id?: string
          is_active?: boolean | null
          name: string
          secret: string
          updated_at?: string | null
          url: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          events?: string[]
          id?: string
          is_active?: boolean | null
          name?: string
          secret?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_endpoints_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_execution_steps: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          execution_id: string
          id: string
          result_data: Json | null
          started_at: string | null
          status: string | null
          step_config: Json
          step_type: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          execution_id: string
          id?: string
          result_data?: Json | null
          started_at?: string | null
          status?: string | null
          step_config: Json
          step_type: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          execution_id?: string
          id?: string
          result_data?: Json | null
          started_at?: string | null
          status?: string | null
          step_config?: Json
          step_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_execution_steps_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "workflow_executions"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_executions: {
        Row: {
          company_id: string
          completed_at: string | null
          context_data: Json | null
          error_message: string | null
          execution_status: string | null
          id: string
          started_at: string | null
          trigger_data: Json
          workflow_id: string
        }
        Insert: {
          company_id: string
          completed_at?: string | null
          context_data?: Json | null
          error_message?: string | null
          execution_status?: string | null
          id?: string
          started_at?: string | null
          trigger_data?: Json
          workflow_id: string
        }
        Update: {
          company_id?: string
          completed_at?: string | null
          context_data?: Json | null
          error_message?: string | null
          execution_status?: string | null
          id?: string
          started_at?: string | null
          trigger_data?: Json
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_schedules: {
        Row: {
          created_at: string | null
          execution_id: string
          id: string
          payload: Json | null
          scheduled_for: string
          status: string | null
          step_id: string | null
        }
        Insert: {
          created_at?: string | null
          execution_id: string
          id?: string
          payload?: Json | null
          scheduled_for: string
          status?: string | null
          step_id?: string | null
        }
        Update: {
          created_at?: string | null
          execution_id?: string
          id?: string
          payload?: Json | null
          scheduled_for?: string
          status?: string | null
          step_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_schedules_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "workflow_executions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_schedules_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "workflow_execution_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          actions: Json | null
          company_id: string
          conditions: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          trigger_config: Json
          updated_at: string | null
        }
        Insert: {
          actions?: Json | null
          company_id: string
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          trigger_config?: Json
          updated_at?: string | null
        }
        Update: {
          actions?: Json | null
          company_id?: string
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          trigger_config?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_gamification_points: {
        Args: {
          company_id_param: string
          description_param?: string
          event_type_param: Database["public"]["Enums"]["gamification_event_type"]
          points_param: number
          reference_id_param?: string
          user_id_param: string
        }
        Returns: string
      }
      analyze_auth_initialization_policies: {
        Args: Record<PropertyKey, never>
        Returns: {
          has_auth_check: boolean
          has_null_safety: boolean
          policy_name: string
          table_name: string
        }[]
      }
      analyze_rls_performance: {
        Args: { days_back?: number }
        Returns: {
          avg_execution_ms: number
          max_execution_ms: number
          policy_name: string
          query_count: number
          slow_queries_count: number
          table_name: string
        }[]
      }
      analyze_rls_policies: {
        Args: Record<PropertyKey, never>
        Returns: {
          has_multiple_select: boolean
          has_permissive_all: boolean
          policy_count: number
          table_name: string
        }[]
      }
      calculate_commission: {
        Args: {
          company_id_param: string
          sale_amount_param: number
          target_percentage_param: number
          user_id_param: string
        }
        Returns: {
          bonus_amount: number
          commission_amount: number
          commission_rate: number
        }[]
      }
      calculate_overdue_days: {
        Args: { due_date: string }
        Returns: number
      }
      calculate_payroll: {
        Args: {
          p_company_id: string
          p_employee_id: string
          p_month: number
          p_year: number
        }
        Returns: string
      }
      calculate_sla_deadline: {
        Args: {
          p_company_id: string
          p_created_at?: string
          p_priority: Database["public"]["Enums"]["ticket_priority"]
          p_ticket_type: Database["public"]["Enums"]["ticket_type"]
        }
        Returns: string
      }
      can_access_company_data: {
        Args: { target_company_id: string; user_uuid?: string }
        Returns: boolean
      }
      can_edit_project: {
        Args: { project_id_param: string; user_id_param?: string }
        Returns: boolean
      }
      can_manage_user: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          p_attempt_type?: string
          p_block_minutes?: number
          p_email?: string
          p_ip_address: unknown
          p_max_attempts?: number
          p_window_minutes?: number
        }
        Returns: Json
      }
      create_audit_log: {
        Args: {
          p_action: string
          p_entity_id?: string
          p_entity_type: string
          p_new_values?: Json
          p_old_values?: Json
        }
        Returns: string
      }
      get_current_user_role_cached: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_project_financial_summary: {
        Args: { p_project_id: string }
        Returns: {
          margem_liquida: number
          margem_percentual: number
          orcamento_custos: number
          orcamento_receita: number
          percentual_orcamento_usado: number
          total_custos: number
          total_receita: number
        }[]
      }
      get_team_members: {
        Args: { manager_id?: string }
        Returns: {
          user_id: string
        }[]
      }
      get_user_company_id: {
        Args: { user_uuid?: string }
        Returns: string
      }
      get_user_company_id_cached: {
        Args: { user_uuid?: string }
        Returns: string
      }
      get_user_company_id_safe: {
        Args: { user_uuid?: string }
        Returns: string
      }
      get_user_department_id: {
        Args: { user_uuid?: string }
        Returns: string
      }
      get_user_role: {
        Args: { user_uuid?: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_company_access: {
        Args: { target_company_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_or_company_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_authenticated: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_company_admin: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      is_company_admin_cached: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      is_company_admin_safe: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      is_department_supervisor: {
        Args: { dept_id?: string; user_uuid?: string }
        Returns: boolean
      }
      is_project_creator: {
        Args: { project_id_param: string; user_id_param?: string }
        Returns: boolean
      }
      is_project_member: {
        Args: { project_id_param: string; user_id_param?: string }
        Returns: boolean
      }
      is_user_manager_of: {
        Args: { manager_id?: string; target_user_id: string }
        Returns: boolean
      }
      process_cadence_enrollments: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_email_variables: {
        Args: {
          p_company_id?: string
          p_content: string
          p_lead_id?: string
          p_opportunity_id?: string
          p_user_id?: string
        }
        Returns: Json
      }
      process_sequence_steps: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_rate_limit: {
        Args: {
          p_attempt_type?: string
          p_email?: string
          p_ip_address: unknown
        }
        Returns: undefined
      }
      rls_optimization_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          after_count: number
          before_count: number
          improvement_percentage: number
          metric_name: string
        }[]
      }
      track_collection_event: {
        Args: {
          p_account_receivable_id: string
          p_automated?: boolean
          p_event_data?: Json
          p_event_type: string
          p_user_id?: string
        }
        Returns: string
      }
      validate_rls_optimizations: {
        Args: Record<PropertyKey, never>
        Returns: {
          admin_policies: number
          performance_score: string
          table_name: string
          total_policies: number
          user_specific_policies: number
        }[]
      }
    }
    Enums: {
      benefit_type:
        | "vale_refeicao"
        | "vale_transporte"
        | "plano_saude"
        | "plano_odontologico"
        | "vale_alimentacao"
        | "outro"
      collection_status: "active" | "suspended" | "completed" | "cancelled"
      commission_status: "calculated" | "approved" | "paid"
      communication_channel: "email" | "whatsapp" | "sms" | "call" | "task"
      company_plan: "free" | "starter" | "professional" | "enterprise"
      company_status: "active" | "inactive" | "suspended" | "trial"
      deduction_type:
        | "inss"
        | "irrf"
        | "fgts"
        | "vale_refeicao"
        | "vale_transporte"
        | "plano_saude"
        | "outro"
      default_risk_level: "low" | "medium" | "high" | "critical"
      department_role: "supervisor" | "agent" | "observer"
      employee_status: "ativo" | "inativo" | "demitido" | "afastado" | "ferias"
      gamification_event_type:
        | "proposta_enviada"
        | "venda_ganha"
        | "meta_batida"
        | "tarefa_concluida"
        | "vendedor_mes"
        | "milestone_50k"
        | "milestone_100k"
        | "milestone_250k"
      hierarchical_role: "administrador" | "supervisor" | "agente"
      interaction_result:
        | "answered"
        | "no_answer"
        | "interested"
        | "not_interested"
        | "callback_requested"
        | "proposal_requested"
      interaction_type: "mensagem" | "email" | "whatsapp" | "chamada" | "visita"
      job_type: "clt" | "pj" | "freelancer" | "estagiario" | "terceirizado"
      lead_status:
        | "novo"
        | "qualificado"
        | "proposta_enviada"
        | "negociacao"
        | "fechado_ganho"
        | "fechado_perdido"
      opportunity_stage:
        | "qualificacao"
        | "proposta_enviada"
        | "negociacao"
        | "fechado_ganho"
        | "fechado_perdido"
      payment_method:
        | "pix"
        | "boleto"
        | "credit_card"
        | "debit_card"
        | "bank_transfer"
      payment_status: "pending" | "paid" | "overdue" | "cancelled" | "partial"
      project_priority: "low" | "medium" | "high" | "urgent"
      project_status:
        | "planning"
        | "active"
        | "on_hold"
        | "completed"
        | "cancelled"
      reminder_type: "email" | "sms" | "whatsapp" | "phone_call"
      sequence_enrollment_status:
        | "active"
        | "paused"
        | "completed"
        | "cancelled"
        | "failed"
      task_priority: "baixa" | "media" | "alta" | "urgente"
      task_status: "pendente" | "em_andamento" | "concluida" | "cancelada"
      task_type:
        | "call"
        | "whatsapp"
        | "email"
        | "meeting"
        | "follow_up"
        | "proposal_send"
      template_type: "welcome" | "follow_up" | "nurture" | "closing" | "custom"
      ticket_priority: "baixa" | "media" | "alta" | "urgente"
      ticket_status:
        | "aberto"
        | "em_atendimento"
        | "pendente_cliente"
        | "encerrado"
      ticket_subject:
        | "instalacao"
        | "duvidas"
        | "garantia"
        | "fatura"
        | "manutencao"
        | "cancelamento"
        | "outros"
      ticket_type: "tecnico" | "financeiro" | "comercial" | "operacional"
      user_role: "vendedor" | "gerente" | "diretor" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      benefit_type: [
        "vale_refeicao",
        "vale_transporte",
        "plano_saude",
        "plano_odontologico",
        "vale_alimentacao",
        "outro",
      ],
      collection_status: ["active", "suspended", "completed", "cancelled"],
      commission_status: ["calculated", "approved", "paid"],
      communication_channel: ["email", "whatsapp", "sms", "call", "task"],
      company_plan: ["free", "starter", "professional", "enterprise"],
      company_status: ["active", "inactive", "suspended", "trial"],
      deduction_type: [
        "inss",
        "irrf",
        "fgts",
        "vale_refeicao",
        "vale_transporte",
        "plano_saude",
        "outro",
      ],
      default_risk_level: ["low", "medium", "high", "critical"],
      department_role: ["supervisor", "agent", "observer"],
      employee_status: ["ativo", "inativo", "demitido", "afastado", "ferias"],
      gamification_event_type: [
        "proposta_enviada",
        "venda_ganha",
        "meta_batida",
        "tarefa_concluida",
        "vendedor_mes",
        "milestone_50k",
        "milestone_100k",
        "milestone_250k",
      ],
      hierarchical_role: ["administrador", "supervisor", "agente"],
      interaction_result: [
        "answered",
        "no_answer",
        "interested",
        "not_interested",
        "callback_requested",
        "proposal_requested",
      ],
      interaction_type: ["mensagem", "email", "whatsapp", "chamada", "visita"],
      job_type: ["clt", "pj", "freelancer", "estagiario", "terceirizado"],
      lead_status: [
        "novo",
        "qualificado",
        "proposta_enviada",
        "negociacao",
        "fechado_ganho",
        "fechado_perdido",
      ],
      opportunity_stage: [
        "qualificacao",
        "proposta_enviada",
        "negociacao",
        "fechado_ganho",
        "fechado_perdido",
      ],
      payment_method: [
        "pix",
        "boleto",
        "credit_card",
        "debit_card",
        "bank_transfer",
      ],
      payment_status: ["pending", "paid", "overdue", "cancelled", "partial"],
      project_priority: ["low", "medium", "high", "urgent"],
      project_status: [
        "planning",
        "active",
        "on_hold",
        "completed",
        "cancelled",
      ],
      reminder_type: ["email", "sms", "whatsapp", "phone_call"],
      sequence_enrollment_status: [
        "active",
        "paused",
        "completed",
        "cancelled",
        "failed",
      ],
      task_priority: ["baixa", "media", "alta", "urgente"],
      task_status: ["pendente", "em_andamento", "concluida", "cancelada"],
      task_type: [
        "call",
        "whatsapp",
        "email",
        "meeting",
        "follow_up",
        "proposal_send",
      ],
      template_type: ["welcome", "follow_up", "nurture", "closing", "custom"],
      ticket_priority: ["baixa", "media", "alta", "urgente"],
      ticket_status: [
        "aberto",
        "em_atendimento",
        "pendente_cliente",
        "encerrado",
      ],
      ticket_subject: [
        "instalacao",
        "duvidas",
        "garantia",
        "fatura",
        "manutencao",
        "cancelamento",
        "outros",
      ],
      ticket_type: ["tecnico", "financeiro", "comercial", "operacional"],
      user_role: ["vendedor", "gerente", "diretor", "admin"],
    },
  },
} as const
