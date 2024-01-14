import { USER_ROLE } from '../enum/user-role.enum';

export interface LoginResponse {
  email: string;
  accessToken: string;
  userName: string;
  role: USER_ROLE;
  id: string;
}
