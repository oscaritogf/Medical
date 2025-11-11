// app/medico/disponibilidad/components/disponibilidad-client.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Plus, Edit, Trash2, CheckCircle } from "lucide-react"
import { crearHorario, actualizarHorario, eliminarHorario } from "../actions"

type Horario = {
  id_disponibilidad: number
  dia_semana: string
  hora_inicio: string
  hora_fin: string
  activo: boolean
}

type DisponibilidadPorDia = {
  dia: string
  horarios: Horario[]
}

type DisponibilidadClientProps = {
  disponibilidadPorDia: DisponibilidadPorDia[]
}

export default function DisponibilidadClient({ disponibilidadPorDia: initialData }: DisponibilidadClientProps) {
  const [disponibilidadPorDia, setDisponibilidadPorDia] = useState(initialData)
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Horario | null>(null)
  const [dia, setDia] = useState("")
  const [horaInicio, setHoraInicio] = useState("")
  const [horaFin, setHoraFin] = useState("")

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append("dia", dia)
    formData.append("horaInicio", horaInicio)
    formData.append("horaFin", horaFin)

    if (editando) {
      formData.append("id", editando.id_disponibilidad.toString())
      await actualizarHorario(formData)
    } else {
      await crearHorario(formData)
    }

    setModalOpen(false)
    resetForm()
  }

  const handleEliminar = async (id: number) => {
    if (confirm("¿Eliminar este horario?")) {
      await eliminarHorario(id)
    }
  }

  const resetForm = () => {
    setEditando(null)
    setDia("")
    setHoraInicio("")
    setHoraFin("")
  }

  const abrirModal = (horario?: Horario) => {
    if (horario) {
      setEditando(horario)
      setDia(horario.dia_semana)
      setHoraInicio(horario.hora_inicio)
      setHoraFin(horario.hora_fin)
    } else {
      resetForm()
    }
    setModalOpen(true)
  }

  const calcularDuracion = (inicio: string, fin: string) => {
    const [hi, mi] = inicio.split(":").map(Number)
    const [hf, mf] = fin.split(":").map(Number)
    const mins = hf * 60 + mf - (hi * 60 + mi)
    return `${Math.floor(mins / 60)}h ${mins % 60}m`
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Disponibilidad</h1>
          <p className="text-muted-foreground">Configura tus horarios de atención</p>
        </div>
        <Button onClick={() => abrirModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Horario
        </Button>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Horarios Configurados</p>
              <p className="text-xs text-blue-700 mt-1">
                Los pacientes podrán agendar citas solo en los horarios que configures aquí
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disponibilidad por Día */}
      <div className="grid gap-6">
        {disponibilidadPorDia.map(({ dia, horarios }) => (
          <Card key={dia}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{dia}</CardTitle>
                  <CardDescription>
                    {horarios.length > 0 ? `${horarios.length} horario(s)` : "Sin horarios"}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => { setDia(dia); abrirModal() }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {horarios.length > 0 ? (
                <div className="space-y-3">
                  {horarios.map((horario) => (
                    <div key={horario.id_disponibilidad} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{horario.hora_inicio} - {horario.hora_fin}</p>
                          <p className="text-sm text-muted-foreground">
                            Duración: {calcularDuracion(horario.hora_inicio, horario.hora_fin)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Activo</Badge>
                        <Button variant="ghost" size="icon" onClick={() => abrirModal(horario)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEliminar(horario.id_disponibilidad)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No hay horarios configurados</p>
                  <Button variant="link" size="sm" className="mt-2" onClick={() => { setDia(dia); abrirModal() }}>
                    Agregar horario
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editando ? "Editar Horario" : "Agregar Horario"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Día de la semana</Label>
              <Select value={dia} onValueChange={setDia} disabled={!!editando}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un día" />
                </SelectTrigger>
                <SelectContent>
                  {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hora de inicio</Label>
                <Input type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} />
              </div>
              <div>
                <Label>Hora de fin</Label>
                <Input type="time" value={horaFin} onChange={e => setHoraFin(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!dia || !horaInicio || !horaFin || horaInicio >= horaFin}>
              {editando ? "Guardar Cambios" : "Crear Horario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}