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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      dias: {
        Row: {
          creado_en: string
          dia_semana: number | null
          fase_id: string | null
          fecha: number
          id: string
          mes_id: string
          nota: string | null
        }
        Insert: {
          creado_en?: string
          dia_semana?: number | null
          fase_id?: string | null
          fecha: number
          id?: string
          mes_id: string
          nota?: string | null
        }
        Update: {
          creado_en?: string
          dia_semana?: number | null
          fase_id?: string | null
          fecha?: number
          id?: string
          mes_id?: string
          nota?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dias_fase_id_fkey"
            columns: ["fase_id"]
            isOneToOne: false
            referencedRelation: "fases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dias_mes_id_fkey"
            columns: ["mes_id"]
            isOneToOne: false
            referencedRelation: "meses"
            referencedColumns: ["id"]
          },
        ]
      }
      fases: {
        Row: {
          cita: string | null
          color_acento: string | null
          color_suave: string | null
          color_texto: string | null
          creado_en: string
          descuento: number
          dia_desde: number
          dia_hasta: number
          id: string
          logica: string | null
          mes_id: string
          nombre: string
          numero: number
          objetivo: string | null
        }
        Insert: {
          cita?: string | null
          color_acento?: string | null
          color_suave?: string | null
          color_texto?: string | null
          creado_en?: string
          descuento: number
          dia_desde: number
          dia_hasta: number
          id?: string
          logica?: string | null
          mes_id: string
          nombre: string
          numero: number
          objetivo?: string | null
        }
        Update: {
          cita?: string | null
          color_acento?: string | null
          color_suave?: string | null
          color_texto?: string | null
          creado_en?: string
          descuento?: number
          dia_desde?: number
          dia_hasta?: number
          id?: string
          logica?: string | null
          mes_id?: string
          nombre?: string
          numero?: number
          objetivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fases_mes_id_fkey"
            columns: ["mes_id"]
            isOneToOne: false
            referencedRelation: "meses"
            referencedColumns: ["id"]
          },
        ]
      }
      meses: {
        Row: {
          actualizado_en: string
          anio: number
          bajada: string | null
          creado_en: string
          creado_por: string | null
          estado: Database["public"]["Enums"]["estado_mes"]
          id: string
          marca: string
          mes: number
          publicado_en: string | null
          regla_oro_contexto: string | null
          regla_oro_frase: string | null
          slug: string | null
          tienda_id: string
          titulo: string
          voz: string | null
        }
        Insert: {
          actualizado_en?: string
          anio: number
          bajada?: string | null
          creado_en?: string
          creado_por?: string | null
          estado?: Database["public"]["Enums"]["estado_mes"]
          id?: string
          marca?: string
          mes: number
          publicado_en?: string | null
          regla_oro_contexto?: string | null
          regla_oro_frase?: string | null
          slug?: string | null
          tienda_id: string
          titulo: string
          voz?: string | null
        }
        Update: {
          actualizado_en?: string
          anio?: number
          bajada?: string | null
          creado_en?: string
          creado_por?: string | null
          estado?: Database["public"]["Enums"]["estado_mes"]
          id?: string
          marca?: string
          mes?: number
          publicado_en?: string | null
          regla_oro_contexto?: string | null
          regla_oro_frase?: string | null
          slug?: string | null
          tienda_id?: string
          titulo?: string
          voz?: string | null
        }
        Relationships: []
      }
      perfiles: {
        Row: {
          creado_en: string
          id: string
          nombre: string | null
          responsabilidad: string | null
          rol: string
          tienda: string
          tienda_id: string | null
        }
        Insert: {
          creado_en?: string
          id: string
          nombre?: string | null
          responsabilidad?: string | null
          rol?: string
          tienda?: string
          tienda_id?: string | null
        }
        Update: {
          creado_en?: string
          id?: string
          nombre?: string | null
          responsabilidad?: string | null
          rol?: string
          tienda?: string
          tienda_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "perfiles_tienda_id_fkey"
            columns: ["tienda_id"]
            isOneToOne: false
            referencedRelation: "tiendas"
            referencedColumns: ["id"]
          },
        ]
      }
      piezas: {
        Row: {
          actualizado_en: string
          asignado_a_id: string | null
          asignado_a_nombre: string | null
          caption: string | null
          completado_en: string | null
          completado_por_id: string | null
          completado_por_nombre: string | null
          creado_en: string
          cta: string | null
          descripcion: string | null
          descripcion_visual: string | null
          dia_id: string
          extra: Json
          gancho: string | null
          id: string
          intencion: string | null
          orden: number
          tipo: Database["public"]["Enums"]["tipo_pieza"]
          titulo: string | null
        }
        Insert: {
          actualizado_en?: string
          asignado_a_id?: string | null
          asignado_a_nombre?: string | null
          caption?: string | null
          completado_en?: string | null
          completado_por_id?: string | null
          completado_por_nombre?: string | null
          creado_en?: string
          cta?: string | null
          descripcion?: string | null
          descripcion_visual?: string | null
          dia_id: string
          extra?: Json
          gancho?: string | null
          id?: string
          intencion?: string | null
          orden?: number
          tipo: Database["public"]["Enums"]["tipo_pieza"]
          titulo?: string | null
        }
        Update: {
          actualizado_en?: string
          asignado_a_id?: string | null
          asignado_a_nombre?: string | null
          caption?: string | null
          completado_en?: string | null
          completado_por_id?: string | null
          completado_por_nombre?: string | null
          creado_en?: string
          cta?: string | null
          descripcion?: string | null
          descripcion_visual?: string | null
          dia_id?: string
          extra?: Json
          gancho?: string | null
          id?: string
          intencion?: string | null
          orden?: number
          tipo?: Database["public"]["Enums"]["tipo_pieza"]
          titulo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "piezas_dia_id_fkey"
            columns: ["dia_id"]
            isOneToOne: false
            referencedRelation: "dias"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          correo: string
          creado_en: string
          cupon: string
          ghl_contact_id: string | null
          ghl_sincronizado: boolean
          id: string
          nombre: string
          origen: string | null
          whatsapp: string | null
        }
        Insert: {
          correo: string
          creado_en?: string
          cupon: string
          ghl_contact_id?: string | null
          ghl_sincronizado?: boolean
          id?: string
          nombre: string
          origen?: string | null
          whatsapp?: string | null
        }
        Update: {
          correo?: string
          creado_en?: string
          cupon?: string
          ghl_contact_id?: string | null
          ghl_sincronizado?: boolean
          id?: string
          nombre?: string
          origen?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      promos: {
        Row: {
          actualizado_en: string
          activa: boolean
          anio: number
          creado_en: string
          cta_texto: string | null
          enlace: string | null
          id: string
          imagen_path: string | null
          imagen_url: string | null
          mes: number
          subtitulo: string | null
          titulo: string | null
        }
        Insert: {
          actualizado_en?: string
          activa?: boolean
          anio: number
          creado_en?: string
          cta_texto?: string | null
          enlace?: string | null
          id?: string
          imagen_path?: string | null
          imagen_url?: string | null
          mes: number
          subtitulo?: string | null
          titulo?: string | null
        }
        Update: {
          actualizado_en?: string
          activa?: boolean
          anio?: number
          creado_en?: string
          cta_texto?: string | null
          enlace?: string | null
          id?: string
          imagen_path?: string | null
          imagen_url?: string | null
          mes?: number
          subtitulo?: string | null
          titulo?: string | null
        }
        Relationships: []
      }
      tiendas: {
        Row: {
          activa: boolean
          creado_en: string
          id: string
          nombre: string
          orden: number
          slug: string
        }
        Insert: {
          activa?: boolean
          creado_en?: string
          id?: string
          nombre: string
          orden?: number
          slug: string
        }
        Update: {
          activa?: boolean
          creado_en?: string
          id?: string
          nombre?: string
          orden?: number
          slug?: string
        }
        Relationships: []
      }
      entregas: {
        Row: {
          alto: number | null
          ancho: number | null
          bytes: number | null
          cloudinary_public_id: string
          cloudinary_url: string
          creada_en: string
          creada_por_id: string | null
          eliminada_en: string | null
          expira_sin_descarga_en: string
          id: string
          nota: string | null
        }
        Insert: {
          alto?: number | null
          ancho?: number | null
          bytes?: number | null
          cloudinary_public_id: string
          cloudinary_url: string
          creada_en?: string
          creada_por_id?: string | null
          eliminada_en?: string | null
          expira_sin_descarga_en: string
          id?: string
          nota?: string | null
        }
        Update: {
          alto?: number | null
          ancho?: number | null
          bytes?: number | null
          cloudinary_public_id?: string
          cloudinary_url?: string
          creada_en?: string
          creada_por_id?: string | null
          eliminada_en?: string | null
          expira_sin_descarga_en?: string
          id?: string
          nota?: string | null
        }
        Relationships: []
      }
      entrega_destinos: {
        Row: {
          creada_en: string
          descargada_en: string | null
          eliminada_en: string | null
          eliminar_en: string | null
          entrega_id: string
          id: string
          tienda_id: string
        }
        Insert: {
          creada_en?: string
          descargada_en?: string | null
          eliminada_en?: string | null
          eliminar_en?: string | null
          entrega_id: string
          id?: string
          tienda_id: string
        }
        Update: {
          creada_en?: string
          descargada_en?: string | null
          eliminada_en?: string | null
          eliminar_en?: string | null
          entrega_id?: string
          id?: string
          tienda_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entrega_destinos_entrega_id_fkey"
            columns: ["entrega_id"]
            isOneToOne: false
            referencedRelation: "entregas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entrega_destinos_tienda_id_fkey"
            columns: ["tienda_id"]
            isOneToOne: false
            referencedRelation: "tiendas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      es_admin: { Args: Record<string, never>; Returns: boolean }
      es_superadmin: { Args: Record<string, never>; Returns: boolean }
      rol_actual: { Args: Record<string, never>; Returns: string }
    }
    Enums: {
      estado_mes: "borrador" | "publicado" | "archivado"
      tipo_pieza:
        | "post"
        | "flyer"
        | "historia"
        | "reel"
        | "live"
        | "carrusel"
        | "cinema"
        | "activacion"
        | "mantenimiento"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"]
export type Enums<T extends keyof DefaultSchema["Enums"]> =
  DefaultSchema["Enums"][T]
