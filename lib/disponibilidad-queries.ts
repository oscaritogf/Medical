// lib/disponibilidad-queries.ts
import pool from './db'

export async function getDisponibilidadMedico(medicoId: number) {
  const [rows]: any = await pool.execute(`
    SELECT 
      d.id_disponibilidad,
      d.dia_semana,
      d.hora_inicio,
      d.hora_fin
    FROM tbl_disponibilidad d
    JOIN tbl_medicos_x_disponibilidad mxd ON d.id_disponibilidad = mxd.fk_id_disponibilidad
    WHERE mxd.fk_id_medico = ?
    ORDER BY 
      FIELD(d.dia_semana, 'Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'),
      d.hora_inicio
  `, [medicoId])

  return rows
}