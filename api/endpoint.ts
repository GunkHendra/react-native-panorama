export const VTOUR_ENDPOINTS = {
    GET_ALL_VTOUR: "api/user/vtour",
    CREATE_VTOUR: "api/user/vtour",
    GET_A_VTOUR: (id: string) => `api/user/vtour/${id}`,
    UPDATE_A_VTOUR: (id: string) => `api/user/vtour/${id}`,
    DELETE_A_VTOUR: (id: string) => `api/user/vtour/${id}`,
    ADD_IMAGE: (id: string) => `api/user/vtour/${id}/add-image`,
    GET_FILES: (id: string) => `api/user/vtour/get-files/${id}`,
}