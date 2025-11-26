import { vtourService } from "@/api/services/vtour"
import { VTour } from "@/interfaces/vtour"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useVtour = (id: string) => {
    return useQuery<VTour, Error>({
        queryKey: ['vtour', id],
        queryFn: () => vtourService.fetchVtour(id),
        enabled: !!id,
    })
}

export const useCreateVtour = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (title: string) => vtourService.createVtour({ title }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vtours'] });
        },
    });
}

export const useUpdateVtour = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, data}: {id:string, data: Partial<VTour>}) => vtourService.updateVtour(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['vtour', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['vtours'] });
        }
    });
}

export const useDeleteVtour = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => vtourService.deleteVtour(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vtours'] });
        }
    });
}

export const useAddNewImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, imageData}: {id: string, imageData: FormData}) => vtourService.addNewImage(id, imageData),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['vtour', variables.id] });
        }
    });
}

export const useUpdateJsonData = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, configData}: {id: string, configData: VTour["editorData"]}) => vtourService.updateJsonData(id, configData),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['vtour', variables.id] });
        }
    });
}

export const useGetFiles = (id: string) => {
    return useQuery({
        queryKey: ['vtour-files', id],
        queryFn: () => vtourService.getFiles(id),
        enabled: !!id,
    });
}