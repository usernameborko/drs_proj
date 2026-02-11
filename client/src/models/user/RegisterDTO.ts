export interface RegisterDTO {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  date_of_birth?: string;
  gender?: string;
  country?: string;
  street?: string;
  number?: string;
}