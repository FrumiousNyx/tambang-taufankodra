import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  company: z.string()
    .min(2, 'Company name is required')
    .max(100, 'Company name must be less than 100 characters'),
  
  email: z.string()
    .email('Invalid email address'),
  
  phone: z.string()
    .regex(/^[+]?[0-9]{8,15}$/, 'Invalid phone number format')
    .min(8, 'Phone number must be at least 8 digits'),
  
  projectType: z.string()
    .min(1, 'Project type is required'),
  
  projectValue: z.string().optional(),
  
  location: z.string()
    .min(3, 'Location must be at least 3 characters')
    .max(200, 'Location must be less than 200 characters'),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
  
  requestProposal: z.boolean().default(false),
});

export type ContactFormData = z.infer<typeof contactSchema>;
