export const getAllUsers = async () => {
  console.log("Fetch all users API called");
  return Promise.resolve([]);
};

export const updateUser = async (userId: string, data: any) => {
  console.log("Update user", userId, data);
  return Promise.resolve({ success: true });
};

export const deleteUser = async (userId: string) => {
  console.log("Delete user", userId);
  return Promise.resolve({ success: true });
};
