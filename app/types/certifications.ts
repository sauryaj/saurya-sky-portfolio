export type CertificationCategory = 'CLOUD' | 'SECURITY' | 'IDENTITY' | 'ENDPOINT';
export type CertificationStatus = 'active' | 'in-progress' | 'replace';

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  category: CertificationCategory;
  issued: string;
  expires?: string;
  description: string;
  skills: string[];
  verificationUrl?: string;
  status: CertificationStatus;
  accent: string;
}
