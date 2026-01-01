export interface VerificationLog {
    id?: number;
    credential_id: number;
    verified_at?: Date;
    verified_by: string;
    is_valid: boolean;
    details?: any;
  }
  