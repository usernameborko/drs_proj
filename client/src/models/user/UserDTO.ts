export interface UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string | null;
  gender: string | null;
  country: string | null;
  street: string | null;
  streetNumber: string | null;
  role: string;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string | null;
}

// Backend koristi snake_case
export interface UserDTOBackend {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string | null;
  gender: string | null;
  country: string | null;
  street: string | null;
  street_number: string | null;
  role: string;
  profile_image: string | null;
  created_at: string;
  updated_at: string | null;
}

export function mapUserDTOFromBackend(backend: UserDTOBackend): UserDTO {
  return {
    id: backend.id,
    firstName: backend.first_name,
    lastName: backend.last_name,
    email: backend.email,
    dateOfBirth: backend.date_of_birth,
    gender: backend.gender,
    country: backend.country,
    street: backend.street,
    streetNumber: backend.street_number,
    role: backend.role,
    profileImage: backend.profile_image,
    createdAt: backend.created_at,
    updatedAt: backend.updated_at,
  };
}