// lib/dashboard-queries.ts
import pool from './db';

export async function getDashboardData(medicoId: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [citasHoy] = await pool.execute(`
    SELECT COUNT(*) as count 
    FROM tbl_citas c 
    JOIN tbl_estado e ON c.fk_id_estado = e.id_estado
    WHERE c.fk_id_medico = ? 
      AND c.fecha_cita >= ? 
      AND c.fecha_cita < ?
  `, [medicoId, today, tomorrow]);

  const [pendientes] = await pool.execute(`
    SELECT COUNT(*) as count 
    FROM tbl_citas c 
    JOIN tbl_estado e ON c.fk_id_estado = e.id_estado
    WHERE c.fk_id_medico = ? AND e.nombre = 'Pendiente'
  `, [medicoId]);

  const [confirmadas] = await pool.execute(`
    SELECT COUNT(*) as count 
    FROM tbl_citas c 
    JOIN tbl_estado e ON c.fk_id_estado = e.id_estado
    WHERE c.fk_id_medico = ? AND e.nombre = 'Confirmada'
  `, [medicoId]);

  const [totalPacientes] = await pool.execute(`
    SELECT COUNT(DISTINCT fk_id_paciente) as count 
    FROM tbl_citas 
    WHERE fk_id_medico = ?
  `, [medicoId]);

  const [proximasCitas]: any = await pool.execute(`
    SELECT 
      c.id_citas, c.fecha_cita, c.motivo,
      p.nombre, p.apellido,
      e.nombre as estado, e.color
    FROM tbl_citas c
    JOIN tbl_pacientes pac ON c.fk_id_paciente = pac.id_paciente
    JOIN tbl_persona p ON pac.fk_id_persona = p.id_persona
    JOIN tbl_estado e ON c.fk_id_estado = e.id_estado
    WHERE c.fk_id_medico = ? AND c.fecha_cita >= NOW()
    ORDER BY c.fecha_cita ASC
    LIMIT 5
  `, [medicoId]);

  return {
    citasHoy: Number(citasHoy[0].count),
    pendientes: Number(pendientes[0].count),
    confirmadas: Number(confirmadas[0].count),
    totalPacientes: Number(totalPacientes[0].count),
    proximasCitas: proximasCitas.map((c: any) => ({
      ...c,
      fecha_cita: new Date(c.fecha_cita)
    }))
  };
}