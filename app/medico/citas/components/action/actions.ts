// app/medico/citas/actions.ts
"use server"

import pool from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function actualizarCita(formData: FormData) {
  const citaId = formData.get("citaId")
  const motivo = formData.get("motivo") as string
  const observaciones = formData.get("observaciones") as string

  await pool.execute(
    `UPDATE tbl_citas SET motivo = ?, observaciones = ? WHERE id_citas = ?`,
    [motivo || null, observaciones || null, citaId]
  )

  revalidatePath("/medico/citas")
}

export async function iniciarConsulta(citaId: number) {
  await pool.execute(
    `UPDATE tbl_citas 
     SET fk_id_estado = (SELECT id_estado FROM tbl_estado WHERE nombre = 'En Proceso')
     WHERE id_citas = ? AND fk_id_estado = (SELECT id_estado FROM tbl_estado WHERE nombre = 'Confirmada')`,
    [citaId]
  )

  revalidatePath("/medico/citas")
}

export async function crearHistorialClinico(formData: FormData) {
  const citaId = formData.get("citaId")
  const diagnostico = formData.get("diagnostico") as string
  const tratamiento = formData.get("tratamiento") as string
  const recomendaciones = formData.get("recomendaciones") as string

  const [medicoRows]: any = await pool.execute(
    `SELECT fk_id_medico FROM tbl_citas WHERE id_citas = ?`,
    [citaId]
  )
  const medicoId = medicoRows[0]?.fk_id_medico

  await pool.execute(
    `INSERT INTO tbl_historial_clinico (fk_id_cita, diagnostico, tratamiento, recomendaciones, fk_id_medico)
     VALUES (?, ?, ?, ?, ?)`,
    [citaId, diagnostico, tratamiento, recomendaciones || null, medicoId]
  )

  await pool.execute(
    `UPDATE tbl_citas 
     SET fk_id_estado = (SELECT id_estado FROM tbl_estado WHERE nombre = 'Completada')
     WHERE id_citas = ?`,
    [citaId]
  )

  revalidatePath("/medico/citas")
}