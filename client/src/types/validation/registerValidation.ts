import type { RegisterDTO } from "../../models/user/RegisterDTO";

export interface RegisterErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  date_of_birth?: string;
  gender?: string;
  country?: string;
  street?: string;
  number?: string;
}

export function validateRegister(data: RegisterDTO): RegisterErrors {
  const errors: RegisterErrors = {};

  if (!data.first_name || data.first_name.trim() === "") {
    errors.first_name = "First name is required";
  }

  if (!data.last_name || data.last_name.trim() === "") {
    errors.last_name = "Last name is required";
  }

  if (!data.email || data.email.trim() === "") {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.password || data.password.trim() === "") {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Minimum 6 characters";
  }

  if (!data.date_of_birth) {
    errors.date_of_birth = "Date of birth is required";
  }

  if (!data.gender) {
    errors.gender = "Gender is required";
  }

  if (!data.country || data.country.trim() === "") {
    errors.country = "Country is required";
  }

  if (!data.street || data.street.trim() === "") {
    errors.street = "Street is required";
  }

  if (!data.number || data.number.trim() === "") {
    errors.number = "Number is required";
  }

  return errors;
}