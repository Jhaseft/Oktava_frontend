import { api } from './api';
import type { AuthUser } from './authApi';

type SendCodeResponse = { message: string };

type VerifyCodeResponse = {
  message: string;
  user?: AuthUser;
};

export const phoneVerificationService = {
  sendCode: (): Promise<SendCodeResponse> =>
    api.post('/auth/send-phone-verification', {}),

  verifyCode: (code: string): Promise<VerifyCodeResponse> =>
    api.post('/auth/verify-phone', { code }),
};
