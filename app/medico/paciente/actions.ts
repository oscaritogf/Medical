// app/medico/pacientes/actions.ts
"use server"

import pool from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function crearEntradaHistorial(formData: FormData) {
  const citaId = formData.get("citaId") as string
  const diagnostico = formData.get("diagnostico") as string
  const tratamiento = formData.get("tratamiento") as string
  const recomendaciones = formData.get("recomendaciones") as string
  const medicoId = formData.get("medicoId") as string

  await pool.execute(
    `INSERT INTO tbl_historial_clinico (fk_id_cita, diagnostico, tratamiento, recomendaciones, fk_id_medico)
     VALUES (?, ?, ?, ?, ?)`,
    [citaId, diagnostico, tratamiento, recomendaciones || null, medicoId]
  )

  // Marcar cita como completada
  await pool.execute(
    `UPDATE tbl_citas 
     SET fk_id_estado = (SELECT id_estado FROM tbl_estado WHERE nombre = 'Completada')
     WHERE id_citas = ?`,
    [citaId]
  )

  revalidatePath("/medico/pacientes")
}