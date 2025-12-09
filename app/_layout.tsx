import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 30,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Stack />
      </QueryClientProvider>
    </SafeAreaProvider >
  )
} 
