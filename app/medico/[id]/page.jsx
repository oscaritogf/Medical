"use client";
import { useEffect, useState } from "react";

export default function CitasMedico({ params }) {
  const { id } = params;
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    fetch(`/api/medicos/${id}/citas`)
      .then(res => res.json())
      .then(data => setCitas(data))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Citas del Médico #{id}</h1>

      {citas.length === 0 ? (
        <p>No hay citas registradas.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Paciente</th>
              <th className="px-4 py-2 border">Fecha</th>
              <th className="px-4 py-2 border">Motivo</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Consultorio</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id_citas}>
                <td className="px-4 py-2 border">
                  {cita.nombre_paciente} {cita.apellido_paciente}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(cita.fecha_cita).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">{cita.motivo}</td>
                <td
                  className="px-4 py-2 border font-semibold"
                  style={{ color: cita.color || "black" }}
                >
                  {cita.estado}
                </td>
                <td className="px-4 py-2 border">{cita.nombre_sala}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
