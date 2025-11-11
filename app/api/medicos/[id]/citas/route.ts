import pool from "@/lib/db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        c.id_citas,
        c.fecha_cita,
        c.motivo,
        c.observaciones,
        e.nombre AS estado,
        e.color,
        p.nombre AS nombre_paciente,
        p.apellido AS apellido_paciente,
        p.dni,
        p.telefono,
        con.nombre_sala,
        con.ubicacion
      FROM tbl_citas c
      INNER JOIN tbl_estado e ON c.fk_id_estado = e.id_estado
      INNER JOIN tbl_pacientes pa ON c.fk_id_paciente = pa.id_paciente
      INNER JOIN tbl_persona p ON pa.fk_id_persona = p.id_persona
      INNER JOIN tbl_consultorios con ON c.fk_id_consultorio = con.id_consultorio
      WHERE c.fk_id_medico = ?
      ORDER BY c.fecha_cita DESC
      `,
      [id]
    );

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error al obtener las citas del médico:", error);
    return new Response(JSON.stringify({ error: "Error en el servidor" }), { status: 500 });
  }
}
