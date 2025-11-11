// app/medico/citas/historial-clinico.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, User } from "lucide-react"
import { getHistorialClinico } from "@/lib/historial-queries"

type HistorialEntry = {
  id_historial: number
  diagnostico: string
  tratamiento: string
  recomendaciones: string | null
  fecha_creacion: Date
  medico_nombre: string
  medico_apellido: string
  estado_cita: string
}

export default async function HistorialClinico({ pacienteDni }: { pacienteDni: string }) {
  const historial: HistorialEntry[] = await getHistorialClinico(pacienteDni)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Historial Clínico
        </CardTitle>
      </CardHeader>
      <CardContent>
        {historial.length > 0 ? (
          <div className="space-y-4">
            {historial.map((entry) => (
              <div key={entry.id_historial} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {entry.fecha_creacion.toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                  <Badge variant="outline">{entry.estado_cita}</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Diagnóstico:</span>
                    <p className="mt-1">{entry.diagnostico}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Tratamiento:</span>
                    <p className="mt-1">{entry.tratamiento}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Recomendaciones:</span>
                    <p className="mt-1">{entry.recomendaciones || "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  Dr. {entry.medico_nombre} {entry.medico_apellido}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No hay historial clínico registrado</p>
            <p className="text-sm mt-1">Este será el primer registro del paciente</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}