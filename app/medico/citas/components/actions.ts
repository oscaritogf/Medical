// app/medico/citas/actions.ts
"use server"

import pool from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function confirmarCita(formData: FormData) {
  const citaId = formData.get("citaId")
  
  await pool.execute(
    `UPDATE tbl_citas 
     SET fk_id_estado = (SELECT id_estado FROM tbl_estado WHERE nombre = 'Confirmada')
     WHERE id_citas = ?`,
    [citaId]
  )

  revalidatePath("/medico/citas")
}

export async function cancelarCita(formData: FormData) {
  const citaId = formData.get("citaId")
  
  await pool.execute(
    `UPDATE tbl_citas 
     SET fk_id_estado = (SELECT id_estado FROM tbl_estado WHERE nombre = 'Cancelada')
     WHERE id_citas = ?`,
    [citaId]
  )

  revalidatePath("/medico/citas")
}