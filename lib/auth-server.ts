// lib/auth-server.ts
import pool from './db';
import { cookies } from 'next/headers';

export async function getCurrentMedico() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('auth_session')?.value;

  if (!sessionCookie) return null;

  try {
    const session = JSON.parse(sessionCookie);

    // Verificar que sea médico
    if (session.rol !== 'medico' || !session.medico?.id_medico) {
      return null;
    }

    // Opcional: volver a validar en BD
    const [rows]: any = await pool.execute(`
      SELECT 
        m.id_medico,
        p.nombre, p.apellido, p.correo, p.telefono,
        e.nombre as especialidad
      FROM tbl_medicos m
      JOIN tbl_persona p ON m.fk_id_persona = p.id_persona
      JOIN tbl_especialidades e ON m.fk_id_especialidad = e.id_especialidad
      WHERE m.id_medico = ? AND m.activo = 1
    `, [session.medico.id_medico]);

    return rows[0] || null;

  } catch (error) {
    console.error('Error parsing session:', error);
    return null;
  }
}