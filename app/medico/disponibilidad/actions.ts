// app/medico/disponibilidad/actions.ts
"use server"

import pool from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getCurrentMedico } from "@/lib/auth-server"

export async function crearHorario(formData: FormData) {
  const medico = await getCurrentMedico()
  if (!medico) throw new Error("No autorizado")

  const dia = formData.get("dia") as string
  const horaInicio = formData.get("horaInicio") as string
  const horaFin = formData.get("horaFin") as string

  // 1. Crear el horario
  const [result]: any = await pool.execute(
    `INSERT INTO tbl_disponibilidad (dia_semana, hora_inicio, hora_fin)
     VALUES (?, ?, ?)`,
    [dia, horaInicio, horaFin]
  )
  const idDisponibilidad = result.insertId

  // 2. Vincular al médico
  await pool.execute(
    `INSERT INTO tbl_medicos_x_disponibilidad (fk_id_medico, fk_id_disponibilidad)
     VALUES (?, ?)`,
    [medico.id_medico, idDisponibilidad]
  )

  revalidatePath("/medico/disponibilidad")
}

export async function actualizarHorario(formData: FormData) {
  const medico = await getCurrentMedico()
  if (!medico) throw new Error("No autorizado")

  const id = formData.get("id") as string
  const horaInicio = formData.get("horaInicio") as string
  const horaFin = formData.get("horaFin") as string

  // Verificar que el horario pertenece al médico
  const [rows]: any = await pool.execute(
    `SELECT 1 FROM tbl_medicos_x_disponibilidad WHERE fk_id_disponibilidad = ? AND fk_id_medico = ?`,
    [id, medico.id_medico]
  )
  if (rows.length === 0) throw new Error("No autorizado")

  await pool.execute(
    `UPDATE tbl_disponibilidad 
     SET hora_inicio = ?, hora_fin = ?
     WHERE id_disponibilidad = ?`,
    [horaInicio, horaFin, id]
  )

  revalidatePath("/medico/disponibilidad")
}

export async function eliminarHorario(id: number) {
  const medico = await getCurrentMedico()
  if (!medico) throw new Error("No autorizado")

  // Verificar permiso
  const [rows]: any = await pool.execute(
    `SELECT 1 FROM tbl_medicos_x_disponibilidad WHERE fk_id_disponibilidad = ? AND fk_id_medico = ?`,
    [id, medico.id_medico]
  )
  if (rows.length === 0) throw new Error("No autorizado")

  // Eliminar relación primero
  await pool.execute(
    `DELETE FROM tbl_medicos_x_disponibilidad WHERE fk_id_disponibilidad = ? AND fk_id_medico = ?`,
    [id, medico.id_medico]
  )

  // Si no hay más médicos usando este horario → eliminarlo
  const [count]: any = await pool.execute(
    `SELECT COUNT(*) as count FROM tbl_medicos_x_disponibilidad WHERE fk_id_disponibilidad = ?`,
    [id]
  )
  if (count[0].count === 0) {
    await pool.execute(`DELETE FROM tbl_disponibilidad WHERE id_disponibilidad = ?`, [id])
  }

  revalidatePath("/medico/disponibilidad")
}