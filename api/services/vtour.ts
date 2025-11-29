import { EditorConfig, PlayerConfig, VTour, VTourApiResponse, VtourDataResponse } from "@/interfaces/vtour";
import api from "../client";
import { VTOUR_ENDPOINTS } from "../endpoint";

const transformApiResponseToVTour = (response: VTourApiResponse): VTour => {
  const data = response.data;
  return {
    title: data.title,
    thumb: data.thumb,
    playerConfig: data.code ? JSON.parse(data.code) : ({} as PlayerConfig),
    editorData: data.json_data ? JSON.parse(data.json_data) : ({} as EditorConfig),
  };
};

export const vtourService = {
  createVtour: async (payload: { title: string }) => {
    const response = await api.post<VTourApiResponse>(VTOUR_ENDPOINTS.CREATE_VTOUR, payload);
    return transformApiResponseToVTour(response.data);
  },

  fetchVtour: async (id: string) => {
    const response = await api.get<VTourApiResponse>(VTOUR_ENDPOINTS.VTOUR_BY_ID(id));
    return transformApiResponseToVTour(response.data);
  },
  
  updateVtour: async (id: string, payload: Partial<VtourDataResponse>) => {
    const response = await api.put<VTourApiResponse>(VTOUR_ENDPOINTS.VTOUR_BY_ID(id), payload);
    return transformApiResponseToVTour(response.data);
  },

  deleteVtour: async (id: string): Promise<any> => {
    const response = await api.delete(VTOUR_ENDPOINTS.VTOUR_BY_ID(id));
    return response.data;
  },

  addNewImage: async (id: string, imageData: FormData) => {
    const response = await api.post(VTOUR_ENDPOINTS.ADD_IMAGE(id), imageData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  updateJsonData: async (id: string, configData: EditorConfig): Promise<VTour> => {
    const payload = {
      json_data: JSON.stringify(configData)
    };

    const response = await api.put<VTourApiResponse>(VTOUR_ENDPOINTS.UPDATE_JSON(id), payload);
    return transformApiResponseToVTour(response.data);
  },

  getFiles: async (id: string) => {
    const response = await api.get(VTOUR_ENDPOINTS.GET_FILES(id));
    return response.data;
  }
};