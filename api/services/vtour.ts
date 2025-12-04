import { EditorConfig, PlayerConfig, VTour, VTourApiResponse, VtourDataResponse } from "@/interfaces/vtour";
import api from "../client";
import { VTOUR_ENDPOINTS } from "../endpoint";

const transformVTourToApiPayload = (vtour: Partial<VTour>): Partial<VtourDataResponse> => {
  const payload: Partial<VtourDataResponse> = {};

  if (vtour.title !== undefined) payload.title = vtour.title;
  if (vtour.thumb !== undefined) payload.thumb = vtour.thumb;

  if (vtour.code !== undefined)
    payload.code = JSON.stringify(vtour.code);

  if (vtour.json_data !== undefined)
    payload.json_data = JSON.stringify(vtour.json_data);

  return payload;
};


const transformApiResponseToVTour = (response: VTourApiResponse): VTour => {
  const data = response.data;
  return {
    title: data.title,
    thumb: data.thumb,
    code: data.code ? JSON.parse(data.code) : ({} as PlayerConfig),
    json_data: data.json_data ? JSON.parse(data.json_data) : ({} as EditorConfig),
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
  
  updateVtour: async (id: string, vtour: Partial<VTour>) => {
    const payload = transformVTourToApiPayload(vtour);
    console.log("Update Vtour Payload:", payload);
    const response = await api.put<VTourApiResponse>(VTOUR_ENDPOINTS.VTOUR_BY_ID(id), payload);
    console.log("Update Vtour Response:", response.data);
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
  
  updateJsonData: async (id: string, configData: Partial<EditorConfig>): Promise<VTour> => {
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