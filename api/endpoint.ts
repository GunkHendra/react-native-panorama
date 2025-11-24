export const VTOUR_ENDPOINTS = {
    CREATE_VTOUR: "api/user/vtour",
    VTOUR_BY_ID: (id: string) => `api/user/vtour/${id}`,
    ADD_IMAGE: (id: string) => `api/user/vtour/${id}/add-image`,
    UPDATE_JSON: (id: string) => `api/user/vtour/${id}/update-json-data`,
    GET_FILES: (id: string) => `api/user/vtour/${id}/get-files`,
}