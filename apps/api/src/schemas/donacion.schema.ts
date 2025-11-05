import { z } from 'zod';

export const donacionSchema = z.object({
  monto: z.number().positive(),
  metodoPago: z.enum(['tarjeta', 'paypal', 'transferencia'])
});
