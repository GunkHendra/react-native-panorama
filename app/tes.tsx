import {
    useCreateVtour,
    useDeleteVtour,
    useUpdateJsonData,
    useUpdateVtour,
    useVtour
} from '@/hooks/useVtour';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const TesScreen = () => {
    // --- Local State for Inputs ---
    const [targetId, setTargetId] = useState<string>(''); // The ID we want to test
    const [newTitle, setNewTitle] = useState('');

    // --- 1. Hook: Fetch Single Tour ---
    // Only runs if targetId is not empty
    const {
        data: vtour,
        isLoading,
        isError,
        error,
        refetch
    } = useVtour(targetId);

    // --- 2. Hook: Create ---
    const createMutation = useCreateVtour();

    // --- 3. Hook: Update General Info ---
    const updateMutation = useUpdateVtour();

    // --- 4. Hook: Delete ---
    const deleteMutation = useDeleteVtour();

    // --- 5. Hook: Update JSON Data ---
    const jsonMutation = useUpdateJsonData();

    // --- Handlers ---

    const handleCreate = () => {
        if (!newTitle) return Alert.alert("Error", "Enter a title");

        createMutation.mutate(newTitle, {
            onSuccess: (data: any) => {
                Alert.alert("Created!", `Check your backend for the ID. Response: ${JSON.stringify(data)}`);
                // If your API returns the ID, you could auto-set it here:
                // setTargetId(data.id); 
            },
            onError: (err) => Alert.alert("Create Failed", err.message)
        });
    };

    const handleUpdateTitle = () => {
        if (!targetId) return;
        updateMutation.mutate({
            id: targetId,
            data: { title: `Updated ${new Date().toLocaleTimeString()}` }
        });
    };

    const handleUpdateJSON = () => {
        if (!targetId || !vtour) return;

        // Simulate modifying the Editor Config
        const newEditorData = { ...vtour.editorData };

        // Safety check: ensure config exists before modifying
        if (newEditorData.config) {
            newEditorData.config.theme = 'dark-theme-tested';
            newEditorData.config.autoRotate = !newEditorData.config.autoRotate;
        }

        jsonMutation.mutate({
            id: targetId,
            configData: newEditorData
        }, {
            onSuccess: () => Alert.alert("Success", "JSON Config Updated!"),
            onError: (err) => Alert.alert("Error", err.message)
        });
    };

    const handleDelete = () => {
        if (!targetId) return;

        Alert.alert("Confirm Delete", "Are you sure?", [
            { text: "Cancel" },
            {
                text: "Delete",
                style: 'destructive',
                onPress: () => {
                    deleteMutation.mutate(targetId, {
                        onSuccess: () => {
                            setTargetId(''); // Clear ID
                            Alert.alert("Deleted", "Tour removed.");
                        }
                    });
                }
            }
        ]);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>VTour API Tester</Text>

            {/* --- SECTION 1: CREATE --- */}
            <View style={styles.card}>
                <Text style={styles.label}>1. Create New Tour</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Tour Title"
                    value={newTitle}
                    onChangeText={setNewTitle}
                />
                <TouchableOpacity
                    style={[styles.btn, styles.btnCreate]}
                    onPress={handleCreate}
                    disabled={createMutation.isPending}
                >
                    <Text style={styles.btnText}>
                        {createMutation.isPending ? "Creating..." : "Create Tour"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* --- SECTION 2: TARGET SELECTION --- */}
            <View style={styles.card}>
                <Text style={styles.label}>2. Manage Tour (Enter ID)</Text>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Paste ID here (e.g. 123)"
                        value={targetId}
                        onChangeText={setTargetId}
                    />
                    <TouchableOpacity style={styles.btnSmall} onPress={() => refetch()}>
                        <Text style={styles.btnText}>Fetch</Text>
                    </TouchableOpacity>
                </View>

                {/* --- STATUS INDICATORS --- */}
                {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
                {isError && <Text style={styles.error}>Error: {error.message}</Text>}

                {/* --- ACTIONS (Only show if data loaded) --- */}
                {vtour && (
                    <View style={styles.actions}>
                        <Text style={styles.dataTitle}>Current Title: {vtour.title}</Text>

                        <TouchableOpacity
                            style={[styles.btn, styles.btnUpdate]}
                            onPress={handleUpdateTitle}
                            disabled={updateMutation.isPending}
                        >
                            <Text style={styles.btnText}>
                                {updateMutation.isPending ? "Updating..." : "Update Title (Random)"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.btn, styles.btnJson]}
                            onPress={handleUpdateJSON}
                            disabled={jsonMutation.isPending}
                        >
                            <Text style={styles.btnText}>
                                {jsonMutation.isPending ? "Saving JSON..." : "Toggle AutoRotate (JSON)"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.btn, styles.btnDelete]}
                            onPress={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            <Text style={styles.btnText}>
                                {deleteMutation.isPending ? "Deleting..." : "Delete Tour"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* --- SECTION 3: DATA VIEWER --- */}
            {vtour && (
                <View style={styles.card}>
                    <Text style={styles.label}>3. Raw Data Preview</Text>
                    <Text style={styles.code}>
                        {JSON.stringify(vtour, null, 2)}
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

export default TesScreen;

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#f5f5f5', paddingBottom: 50 },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5, marginBottom: 10, backgroundColor: '#fff' },
    row: { flexDirection: 'row', gap: 10 },

    // Buttons
    btn: { padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 5 },
    btnSmall: { padding: 10, borderRadius: 5, backgroundColor: '#666', justifyContent: 'center' },
    btnCreate: { backgroundColor: '#4CAF50' },
    btnUpdate: { backgroundColor: '#2196F3' },
    btnJson: { backgroundColor: '#9C27B0' },
    btnDelete: { backgroundColor: '#F44336' },
    btnText: { color: 'white', fontWeight: 'bold' },

    // Data
    dataTitle: { fontSize: 16, marginBottom: 10, color: '#555' },
    error: { color: 'red', marginVertical: 10 },
    actions: { gap: 10, marginTop: 10 },
    code: { fontFamily: 'monospace', fontSize: 10, color: '#333' }
});