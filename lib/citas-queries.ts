// lib/citas-queries.ts
import pool from './db';

export async function getCitasDelMedico(medicoId: number) {
  const [rows]: any = await pool.execute(`
    SELECT 
      c.id_citas,
      c.fecha_cita,
      c.motivo,
      c.observaciones,
      p.nombre,
      p.apellido,
      p.dni,
      p.telefono,
      p.correo,
      e.nombre as estado,
      e.color,
      con.nombre_sala,
      con.ubicacion
    FROM tbl_citas c
    JOIN tbl_pacientes pac ON c.fk_id_paciente = pac.id_paciente
    JOIN tbl_persona p ON pac.fk_id_persona = p.id_persona
    JOIN tbl_estado e ON c.fk_id_estado = e.id_estado
    JOIN tbl_consultorios con ON c.fk_id_consultorio = con.id_consultorio
    WHERE c.fk_id_medico = ?
    ORDER BY c.fecha_cita DESC
  `, [medicoId]);

  return rows.map((c: any) => ({
    ...c,
    fecha_cita: new Date(c.fecha_cita)
  }));
}