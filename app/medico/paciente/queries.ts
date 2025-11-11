// app/medico/pacientes/queries.ts
import pool from "@/lib/db"

export async function getPacientesDelMedico(medicoId: number) {
  const [rows]: any = await pool.execute(`
    SELECT DISTINCT
      pac.id_paciente,
      per.nombre,
      per.apellido,
      per.dni,
      per.telefono,
      per.correo,
      COUNT(c.id_citas) as total_citas
    FROM tbl_pacientes pac
    JOIN tbl_persona per ON pac.fk_id_persona = per.id_persona
    JOIN tbl_citas c ON pac.id_paciente = c.fk_id_paciente
    WHERE c.fk_id_medico = ?
    GROUP BY pac.id_paciente
    ORDER BY per.apellido, per.nombre
  `, [medicoId])

  return rows
}

export async function getHistorialPaciente(pacienteId: number) {
  const [rows]: any = await pool.execute(`
    SELECT 
      h.id_historial,
      h.diagnostico,
      h.tratamiento,
      h.recomendaciones,
      h.fecha_creacion,
      c.fecha_cita,
      c.motivo,
      e.nombre as estado_cita,
      m.nombre as medico_nombre,
      m.apellido as medico_apellido
    FROM tbl_historial_clinico h
    JOIN tbl_citas c ON h.fk_id_cita = c.id_citas
    JOIN tbl_estado e ON c.fk_id_estado = e.id_estado
    JOIN tbl_medicos med ON h.fk_id_medico = med.id_medico
    JOIN tbl_persona m ON med.fk_id_persona = m.id_persona
    WHERE c.fk_id_paciente = ?
    ORDER BY h.fecha_creacion DESC
  `, [pacienteId])

  return rows.map((h: any) => ({
    ...h,
    fecha_cita: new Date(h.fecha_cita),
    fecha_creacion: new Date(h.fecha_creacion)
  }))
}