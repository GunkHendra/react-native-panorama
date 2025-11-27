import api from "../client";
import { VTOUR_ENDPOINTS } from "../endpoint";

export const fetchPanoramaData = async (panoramaId: string) => {
  try {
    const response = await api.get(`${VTOUR_ENDPOINTS.VTOUR_BY_ID}/${panoramaId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching panorama data:", error);
    throw error;
  }
};