import { z } from "zod";

export const createSupportSchema = z.object({
  category: z.enum(["Error técnico", "Sugerencia", "Pregunta", "Otro"], {
    required_error: "La categoría es requerida",
  }),
  message: z
    .string({ required_error: "El mensaje es requerido" })
    .min(1, { message: "El mensaje debe tener al menos 10 caracteres" })
    .max(1000, { message: "El mensaje no puede superar los 1000 caracteres" }),
});


export const updateSupportSchema = z.object({
  status: z
    .string({
      required_error: "El estado es requerido",
      invalid_type_error: "El estado debe ser un texto",
    })
    .refine((val) => ["Pendiente", "En proceso", "Resuelto"].includes(val), {
      message: "El estado debe ser 'Pendiente', 'En proceso' o 'Resuelto'",
    }),
});
