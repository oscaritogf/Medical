// lib/historial-queries.ts
import pool from './db'

export async function getHistorialClinico(pacienteDni: string) {
  if (!pool) return []

  const [rows]: any = await pool.execute(`
    SELECT 
      h.id_historial,
      h.diagnostico,
      h.tratamiento,
      h.recomendaciones,
      h.fecha_creacion,
      p.nombre as medico_nombre,
      p.apellido as medico_apellido,
      e.nombre as estado_cita
    FROM tbl_historial_clinico h
    JOIN tbl_citas c ON h.fk_id_cita = c.id_citas
    JOIN tbl_medicos m ON h.fk_id_medico = m.id_medico
    JOIN tbl_persona p ON m.fk_id_persona = p.id_persona
    JOIN tbl_estado e ON c.fk_id_estado = e.id_estado
    JOIN tbl_pacientes pac ON c.fk_id_paciente = pac.id_paciente
    JOIN tbl_persona pp ON pac.fk_id_persona = pp.id_persona
    WHERE pp.dni = ?
    ORDER BY h.fecha_creacion DESC
    LIMIT 10
  `, [pacienteDni])

  return rows.map((h: any) => ({
    ...h,
    fecha_creacion: new Date(h.fecha_creacion)
  }))
}