// app/medico/citas/cita-modal.tsx
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Phone, Mail, FileText, MapPin, Stethoscope } from "lucide-react"

type Cita = {
  id_citas: number
  fecha_cita: Date
  motivo: string | null
  observaciones: string | null
  nombre: string
  apellido: string
  dni: string
  telefono: string | null
  correo: string | null
  estado: string
  color: string
  nombre_sala: string
  ubicacion: string
}

type CitaModalProps = {
  cita: Cita
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CitaModal({ cita, open, onOpenChange }: CitaModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Detalle de la Cita
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Paciente */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Paciente
            </h3>
            <div className="grid grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm text-muted-foreground">Nombre completo</p>
                <p className="font-medium">{cita.nombre} {cita.apellido}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">DNI</p>
                <p className="font-medium">{cita.dni}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Teléfono
                </p>
                <p className="font-medium">{cita.telefono || "No registrado"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Correo
                </p>
                <p className="font-medium">{cita.correo || "No registrado"}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Cita */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Información de la Cita
            </h3>
            <div étudiants className="grid grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm text-muted-foreground">Fecha y hora</p>
                <p className="font-medium">
                  {cita.fecha_cita.toLocaleDateString("es-ES", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })} - {cita.fecha_cita.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <Badge
                  variant="outline"
                  style={{
                    backgroundColor: cita.color ? `${cita.color}20` : '#e5e7eb20',
                    color: cita.color || '#6b7280',
                    borderColor: cita.color || '#e5e7eb',
                  }}
                >
                  {cita.estado}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Motivo</p>
                <p className="font-medium">{cita.motivo || "Consulta general"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Observaciones</p>
                <p className="font-medium text-foreground/80">
                  {cita.observaciones || "Sin observaciones"}
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Ubicación */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Consultorio
            </h3>
            <div className="pl-7">
              <p className="font-medium">{cita.nombre_sala}</p>
              <p className="text-sm text-muted-foreground">{cita.ubicacion}</p>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Médico */}
          <div className="flex items-center gap-3 pl-7">
            <Stethoscope className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Médico asignado</p>
              <p className="font-medium">Dr. {cita.nombre} {cita.apellido}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}