// app/medico/citas/citas-list-client.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye, CheckCircle, XCircle } from "lucide-react"
import CitaModal from "./cita-modal"
import ConfirmarCitaButton from "./confirmar-cita-button"
import CancelarCitaButton from "./cancelar-cita-button"

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

type CitasListClientProps = {
  citas: Cita[]
}

export default function CitasListClient({ citas }: CitasListClientProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null)

  return (
    <>
      <div className="space-y-4">
        {citas.map((cita) => (
          <div
            key={cita.id_citas}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">
                    {cita.nombre} {cita.apellido}
                  </p>
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
                <p className="text-sm text-muted-foreground">{cita.motivo || "Consulta general"}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {cita.nombre_sala} - {cita.ubicacion}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {cita.fecha_cita.toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {cita.fecha_cita.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCitaSeleccionada(cita)
                  setModalOpen(true)
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver
              </Button>
              {cita.estado === "Pendiente" && (
                <>
                  <ConfirmarCitaButton citaId={cita.id_citas} />
                  <CancelarCitaButton citaId={cita.id_citas} />
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {citaSeleccionada && (
        <CitaModal
          cita={citaSeleccionada}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
    </>
  )
}