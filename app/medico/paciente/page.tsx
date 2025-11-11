// app/medico/pacientes/page.tsx
import { getCurrentMedico } from "@/lib/auth-server"
import { getPacientesDelMedico, getHistorialPaciente } from "./queries"
import { redirect } from "next/navigation"
import PacientesMedicoClient from "./components/pacientes-client"

export default async function PacientesMedicoPage({
  searchParams,
}: {
  searchParams: Promise<{ paciente?: string }>
}) {
  const medico = await getCurrentMedico()
  if (!medico) redirect("/login")

  const params = await searchParams
  const pacienteId = params.paciente ? parseInt(params.paciente) : null

  const pacientes = await getPacientesDelMedico(medico.id_medico)
  const historial = pacienteId ? await getHistorialPaciente(pacienteId) : []

  return (
    <PacientesMedicoClient
      pacientes={pacientes}
      historial={historial}
      pacienteSeleccionado={pacienteId}
      medicoId={medico.id_medico}
    />
  )
}