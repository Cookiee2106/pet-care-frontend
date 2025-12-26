import { api } from "../utils/api";

export async function getVeterinarians(page = 0, size = 10) {
  try {
    const result = await api.get(`/veterinarians/get-all-veterinarians?page=${page}&size=${size}`);
    return result.data;
  } catch (error) {
    throw error;
  }
}

export async function findAvailableVeterinarians(searchParams) {
  try {
    const queryParams = new URLSearchParams(searchParams);

    const result = await api.get(
      `/veterinarians/search-veterinarian?${queryParams}`
    );
    return result.data;
  } catch (error) {
    throw error;
  }
}

export const getAllSpecializations = async () => {
  try {
    const response = await api.get("/veterinarians/vet/get-all-specialization");
    return response.data;
  } catch (error) {
    throw error;
  }
};
