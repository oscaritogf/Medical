"use client"

import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import { useFormStatus } from "react-dom"
import { cancelarCita } from "./actions"

export default function CancelarCitaButton({ citaId }: { citaId: number }) {
  const { pending } = useFormStatus()

  return (
    <form action={cancelarCita}>
      <input type="hidden" name="citaId" value={citaId} />
      <Button 
        variant="outline" 
        size="sm" 
        className="text-red-600 border-red-600"
        disabled={pending}
      >
        <XCircle className="w-4 h-4 mr-2" />
        {pending ? "Cancelando..." : "Cancelar"}
      </Button>
    </form>
  )
}
