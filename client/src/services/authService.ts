export const login = async (email: string, password: string) => {
  console.log("Login API called", email, password);
  return Promise.resolve({ token: "fake-jwt-token" });
};

export const register = async (userData: any) => {
  console.log("Register API called", userData);
  return Promise.resolve({ success: true });
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};
