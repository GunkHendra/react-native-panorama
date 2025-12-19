import {
  DirectoryItem,
  VTour,
  VTourApiResponse,
  VTourStringified,
} from "@/interfaces/vtour";
import api from "../client";
import { VTOUR_ENDPOINTS } from "../endpoint";

const transformVTourToApiPayload = (
  vtour: Partial<VTour>,
): Partial<VTourStringified> => {
  const payload: Partial<VTourStringified> = {};

  if (vtour.title !== undefined) payload.title = vtour.title;
  if (vtour.thumb !== undefined) payload.thumb = vtour.thumb;

  if (vtour.code !== undefined) payload.code = JSON.stringify(vtour.code);

  if (vtour.json_data !== undefined)
    payload.json_data = JSON.stringify(vtour.json_data);

  if (vtour.status !== undefined) payload.status = vtour.status;

  return payload;
};

export const vtourService = {
  getAllVtours: async () => {
    const response = await api.get<VTourApiResponse<VTour[]>>(
      VTOUR_ENDPOINTS.GET_ALL_VTOUR,
    );
    return response.data.data;
  },

  createVtour: async (payload: { title: string }) => {
    const response = await api.post<VTourApiResponse<VTour>>(
      VTOUR_ENDPOINTS.CREATE_VTOUR,
      payload,
    );
    return response.data.data;
  },

  fetchVtour: async (id: string) => {
    const response = await api.get<VTourApiResponse<VTour>>(
      VTOUR_ENDPOINTS.GET_A_VTOUR(id),
    );
    return response.data.data;
  },

  updateVtour: async (id: string, vtour: Partial<VTour>) => {
    const payload = transformVTourToApiPayload(vtour);
    const response = await api.put<VTourApiResponse<VTourStringified>>(
      VTOUR_ENDPOINTS.UPDATE_A_VTOUR(id),
      payload,
    );
    return response.data.data;
  },

  deleteVtour: async (id: string) => {
    const response = await api.delete<VTourApiResponse<string>>(
      VTOUR_ENDPOINTS.DELETE_A_VTOUR(id),
    );
    return response.data.data;
  },

  addNewImage: async (id: string, imageData: FormData) => {
    const response = await api.post<VTourApiResponse<string>>(
      VTOUR_ENDPOINTS.ADD_IMAGE(id),
      imageData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  getFiles: async (id: string) => {
    const response = await api.get<VTourApiResponse<DirectoryItem[]>>(
      VTOUR_ENDPOINTS.GET_FILES(id),
    );
    return response.data.data;
  },
};
