import { z } from "zod";

export const createPackageSchema = z.object({
  name: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser un texto",
    })
    .min(1)
    .max(255),
  description: z
    .string({
      invalid_type_error: "La descripción debe ser un texto",
    })
    .max(1000)
    .optional(),
  priority: z
    .number({
      required_error: "La prioridad es requerida",
      invalid_type_error: "La prioridad debe ser un número",
    })
    .int()
    .min(0, { message: "La prioridad debe ser al menos 0" })
    .max(10, { message: "La prioridad no puede ser mayor a 10" }),
  destinationAddress: z
    .string({
      required_error: "La dirección de destino es requerida",
      invalid_type_error: "La dirección de destino debe ser un texto",
    })
    .min(1)
    .max(255),
  destinationLatitude: z
    .number({
      invalid_type_error: "La latitud debe ser un número",
    })
    .min(-90, { message: "La latitud debe estar entre -90 y 90" })
    .max(90, { message: "La latitud debe estar entre -90 y 90" })
    .optional()
    .nullable(),
  destinationLongitude: z
    .number({
      invalid_type_error: "La longitud debe ser un número",
    })
    .min(-180, { message: "La longitud debe estar entre -180 y 180" })
    .max(180, { message: "La longitud debe estar entre -180 y 180" })
    .optional()
    .nullable(),
});

export const updatePackageSchema = z.object({
    name: z
      .string({
        invalid_type_error: "El nombre debe ser un texto",
      })
      .min(1)
      .max(255)
      .optional(),
    description: z
      .string({
        invalid_type_error: "La descripción debe ser un texto",
      })
      .max(1000)
      .optional(),
    priority: z
      .number({
        invalid_type_error: "La prioridad debe ser un número",
      })
      .int()
      .min(0, { message: "La prioridad debe ser al menos 0" })
      .max(10, { message: "La prioridad no puede ser mayor a 10" })
      .optional(),
    destinationAddress: z
      .string({
        invalid_type_error: "La dirección de destino debe ser un texto",
      })
      .min(1)
      .max(255)
      .optional(),
    destinationLatitude: z
      .number({
        invalid_type_error: "La latitud debe ser un número",
      })
      .min(-90, { message: "La latitud debe estar entre -90 y 90" })
      .max(90, { message: "La latitud debe estar entre -90 y 90" })
      .optional()
      .nullable(),
    destinationLongitude: z
      .number({
        invalid_type_error: "La longitud debe ser un número",
      })
      .min(-180, { message: "La longitud debe estar entre -180 y 180" })
      .max(180, { message: "La longitud debe estar entre -180 y 180" })
      .optional()
      .nullable(),
  });
  
