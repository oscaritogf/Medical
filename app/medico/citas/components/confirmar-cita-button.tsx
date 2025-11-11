// app/medico/citas/confirmar-cita-button.tsx
"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useFormStatus } from "react-dom"
import { confirmarCita } from "./actions"

export default function ConfirmarCitaButton({ citaId }: { citaId: number }) {
  const { pending } = useFormStatus()

  return (
    <form action={confirmarCita}>
      <input type="hidden" name="citaId" value={citaId} />
      <Button 
        variant="outline" 
        size="sm" 
        className="text-green-600 border-green-600"
        disabled={pending}
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        {pending ? "Confirmando..." : "Confirmar"}
      </Button>
    </form>
  )
}