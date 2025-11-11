import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

// Configura tu conexión MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
})

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        m.id_medico,
        m.descripcion,
        m.activo,
        p.id_persona,
        p.nombre,
        p.apellido,
        p.dni,
        p.telefono,
        p.correo,
        e.id_especialidad,
        e.nombre AS especialidad_nombre
      FROM tbl_medicos m
      JOIN tbl_persona p ON m.fk_id_persona = p.id_persona
      JOIN tbl_especialidades e ON m.fk_id_especialidad = e.id_especialidad
    `)

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error al obtener médicos:", error)
    return NextResponse.json({ error: "Error al obtener médicos" }, { status: 500 })
  }
}
