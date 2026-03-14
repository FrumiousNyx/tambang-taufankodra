import { z } from 'zod';

export const getContactSchema = (language: string) => z.object({
  name: z.string()
    .min(1, language === 'zh' ? '姓名必填' : language === 'id' ? 'Nama wajib diisi' : 'Name is required')
    .min(3, language === 'zh' ? '姓名至少3个字符' : language === 'id' ? 'Nama minimal 3 karakter' : 'Name must be at least 3 characters')
    .max(100, language === 'zh' ? '姓名必须少于100个字符' : language === 'id' ? 'Nama harus kurang dari 100 karakter' : 'Name must be less than 100 characters'),
  
  company: z.string()
    .min(1, language === 'zh' ? '公司必填' : language === 'id' ? 'Perusahaan wajib diisi' : 'Company is required')
    .min(2, language === 'zh' ? '公司名称必填' : language === 'id' ? 'Nama perusahaan wajib diisi' : 'Company name is required')
    .max(100, language === 'zh' ? '公司名称必须少于100个字符' : language === 'id' ? 'Nama perusahaan harus kurang dari 100 karakter' : 'Company name must be less than 100 characters'),
  
  email: z.string()
    .min(1, language === 'zh' ? '邮箱必填' : language === 'id' ? 'Email wajib diisi' : 'Email is required')
    .email(language === 'zh' ? '邮箱格式无效' : language === 'id' ? 'Format email tidak valid' : 'Invalid email format'),
  
  phone: z.string()
    .min(1, language === 'zh' ? '电话号码必填' : language === 'id' ? 'Nomor telepon wajib diisi' : 'Phone number is required')
    .regex(/^[+]?[0-9]{8,15}$/, language === 'zh' ? '电话号码格式无效' : language === 'id' ? 'Format nomor telepon tidak valid' : 'Invalid phone number format')
    .min(8, language === 'zh' ? '电话号码必须至少8位数字' : language === 'id' ? 'Nomor telepon harus minimal 8 digit' : 'Phone number must be at least 8 digits'),
  
  projectType: z.string()
    .min(1, language === 'zh' ? '项目类型必选' : language === 'id' ? 'Tipe proyek wajib dipilih' : 'Project type is required'),
  
  projectValue: z.string().optional(),
  
  location: z.string()
    .min(1, language === 'zh' ? '项目地点必填' : language === 'id' ? 'Lokasi proyek wajib diisi' : 'Project location is required')
    .min(3, language === 'zh' ? '地点至少3个字符' : language === 'id' ? 'Lokasi minimal 3 karakter' : 'Location must be at least 3 characters')
    .max(200, language === 'zh' ? '地点必须少于200个字符' : language === 'id' ? 'Lokasi harus kurang dari 200 karakter' : 'Location must be less than 200 characters'),
  
  message: z.string()
    .min(1, language === 'zh' ? '消息必填' : language === 'id' ? 'Pesan wajib diisi' : 'Message is required')
    .min(10, language === 'zh' ? '消息至少10个字符' : language === 'id' ? 'Pesan minimal 10 karakter' : 'Message must be at least 10 characters')
    .max(1000, language === 'zh' ? '消息必须少于1000个字符' : language === 'id' ? 'Pesan harus kurang dari 1000 karakter' : 'Message must be less than 1000 characters'),
  
  hp_field: z.string().optional(),
  
  requestProposal: z.boolean().default(false),
});

export type ContactFormData = z.infer<ReturnType<typeof getContactSchema>>;
