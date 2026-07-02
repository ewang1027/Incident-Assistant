import { useQuery } from "@tanstack/react-query";
import { getIncident, getIncidents, getMetrics } from "@/lib/api";

export function useIncidents() {
  return useQuery({
    queryKey: ["incidents"],
    queryFn: getIncidents,
  });
}

export function useIncident(id: string | undefined) {
  return useQuery({
    queryKey: ["incidents", id],
    queryFn: () => getIncident(id as string),
    enabled: Boolean(id),
  });
}

export function useMetrics() {
  return useQuery({
    queryKey: ["metrics"],
    queryFn: getMetrics,
  });
}
