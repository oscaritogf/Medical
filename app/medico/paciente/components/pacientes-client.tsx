// app/medico/pacientes/components/pacientes-client.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, User, Calendar, Stethoscope, Plus, FileText } from "lucide-react"
import { crearEntradaHistorial } from "../actions"
import { format } from "date-fns"
import { es } from "date-fns/locale"

type Paciente = {
  id_paciente: number
  nombre: string
  apellido: string
  dni: string
  telefono: string | null
  correo: string | null
  total_citas: number
}

type Historial = {
  id_historial: number
  diagnostico: string
  tratamiento: string
  recomendaciones: string | null
  fecha_creacion: Date
  fecha_cita: Date
  motivo: string
  estado_cita: string
  medico_nombre: string
  medico_apellido: string
}

type PacientesClientProps = {
  pacientes: Paciente[]
  historial: Historial[]
  pacienteSeleccionado: number | null
  medicoId: number
}

export default function PacientesMedicoClient({
  pacientes,
  historial,
  pacienteSeleccionado,
  medicoId
}: PacientesClientProps) {
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [citaId, setCitaId] = useState("")
  const [diagnostico, setDiagnostico] = useState("")
  const [tratamiento, setTratamiento] = useState("")
  const [recomendaciones, setRecomendaciones] = useState("")

  const paciente = pacientes.find(p => p.id_paciente === pacienteSeleccionado)

  const pacientesFiltrados = pacientes.filter(p =>
    `${p.nombre} ${p.apellido}`.toLowerCase().includes(search.toLowerCase()) ||
    p.dni.includes(search)
  )

  const handleNuevaEntrada = async () => {
    const formData = new FormData()
    formData.append("citaId", citaId)
    formData.append("diagnostico", diagnostico)
    formData.append("tratamiento", tratamiento)
    formData.append("recomendaciones", recomendaciones)
    formData.append("medicoId", medicoId.toString())

    await crearEntradaHistorial(formData)
    setModalOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setCitaId("")
    setDiagnostico("")
    setTratamiento("")
    setRecomendaciones("")
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestión de Pacientes</h1>
        <p className="text-muted-foreground">Controla el historial clínico de tus pacientes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de pacientes */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Mis Pacientes</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar paciente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pacientesFiltrados.map((p) => (
                <a
                  key={p.id_paciente}
                  href={`?paciente=${p.id_paciente}`}
                  className={`block p-3 rounded-lg border transition-colors ${
                    pacienteSeleccionado === p.id_paciente ? "bg-primary/10 border-primary" : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{p.nombre} {p.apellido}</p>
                      <p className="text-sm text-muted-foreground">DNI: {p.dni}</p>
                    </div>
                    <Badge variant="secondary">{p.total_citas} citas</Badge>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Historial del paciente seleccionado */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {paciente ? `${paciente.nombre} ${paciente.apellido}` : "Selecciona un paciente"}
              </CardTitle>
              {paciente && (
                <Button size="sm" onClick={() => setModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Entrada
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {paciente ? (
              historial.length > 0 ? (
                <div className="space-y-4">
                  {historial.map((entry) => (
                    <div key={entry.id_historial} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {format(entry.fecha_cita, "PPP", { locale: es })}
                        </p>
                        <Badge variant="outline">{entry.estado_cita}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.motivo}</p>

                      <div className="grid md:grid-cols-3 gap-4 text-sm">
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

                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Stethoscope className="w-3 h-3" />
                        Dr. {entry.medico_nombre} {entry.medico_apellido}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-12 text-muted-foreground">
                  No hay historial clínico para este paciente
                </p>
              )
            ) : (
              <p className="text-center py-12 text-muted-foreground">
                <User className="w-16 h-16 mx-auto mb-4 opacity-50" />
                Selecciona un paciente para ver su historial
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal Nueva Entrada */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Entrada en Historial</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Cita</label>
              <Select value={citaId} onValueChange={setCitaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una cita pasada" />
                </SelectTrigger>
                <SelectContent>
                  {historial
                    .filter(h => h.estado_cita !== "Completada")
                    .map(h => (
                      <SelectItem key={h.id_historial} value={h.id_historial.toString()}>
                        {format(h.fecha_cita, "PPP", { locale: es })} - {h.motivo}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Diagnóstico *</label>
              <Textarea
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
                placeholder="Describa el diagnóstico..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tratamiento *</label>
              <Textarea
                value={tratamiento}
                onChange={(e) => setTratamiento(e.target.value)}
                placeholder="Indique el tratamiento..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Recomendaciones</label>
              <Textarea
                value={recomendaciones}
                onChange={(e) => setRecomendaciones(e.target.value)}
                placeholder="Opcional..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button 
              onClick={handleNuevaEntrada}
              disabled={!citaId || !diagnostico || !tratamiento}
            >
              Guardar Entrada
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
