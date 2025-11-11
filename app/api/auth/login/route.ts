// app/api/auth/login/route.ts
import pool from "@/lib/db"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Faltan credenciales" }, { status: 400 })
    }

    const [rows] = await pool.query(
      `SELECT 
        u.id_usuario, u.email, u.password, u.activo,
        p.id_persona, p.nombre, p.apellido, p.dni, p.telefono, p.correo,
        m.id_medico, pa.id_paciente, a.id_administrador
      FROM tbl_usuarios u
      LEFT JOIN tbl_medicos m ON u.id_usuario = m.fk_id_usuario
      LEFT JOIN tbl_pacientes pa ON u.id_usuario = pa.fk_id_usuario
      LEFT JOIN tbl_administrador a ON u.id_usuario = a.fk_id_usuario
      LEFT JOIN tbl_persona p ON (m.fk_id_persona = p.id_persona OR pa.fk_id_persona = p.id_persona OR a.fk_id_persona = p.id_persona)
      WHERE u.email = ? OR p.dni = ? LIMIT 1`,
      [username, username],
    )

    const users = Array.isArray(rows) ? rows : []
    if (users.length === 0) {
      return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 })
    }

    const user = users[0] as any

    if (!user.activo) {
      return NextResponse.json({ error: "Usuario inactivo" }, { status: 401 })
    }

    const isBcryptHash = user.password?.match(/^\$2[aby]\$/)
    const isValid = isBcryptHash
      ? await bcrypt.compare(password, user.password)
      : password === user.password

    if (!isValid) {
      return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 })
    }

    const [roleRows] = await pool.query(
      `SELECT r.nombre FROM tbl_rol_x_usuario rxu
       JOIN tbl_rol r ON rxu.fk_id_rol = r.id_rol
       WHERE rxu.fk_id_usuario = ?`,
      [user.id_usuario],
    )

    const rol = roleRows[0]?.nombre || "paciente"

    const authUser = {
      id_usuario: user.id_usuario,
      email: user.email,
      rol,
      persona: {
        id_persona: user.id_persona || 0,
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        dni: user.dni || "",
        telefono: user.telefono || "",
        correo: user.correo || "",
      },
      medico: user.id_medico ? { id_medico: user.id_medico } : null,
      paciente: user.id_paciente ? { id_paciente: user.id_paciente } : null,
      administrador: user.id_administrador ? { id_administrador: user.id_administrador } : null,
    }

    // GUARDAR EN COOKIE SEGURA
    const response = NextResponse.json({
      message: "Inicio de sesión exitoso",
      user: authUser,
    })

    response.cookies.set("auth_session", JSON.stringify(authUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })

    return response

  } catch (error) {
    console.error("[Login] Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}