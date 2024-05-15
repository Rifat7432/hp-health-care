export type TCreateAdminData = {
  password: string;
  admin: Admin;
};

export interface Admin {
  name: string;
  email: string;
  contactNumber: string;
}
