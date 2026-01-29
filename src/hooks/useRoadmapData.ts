import { useQuery } from '@tanstack/react-query';

const ROADMAP_URL = 'https://decentraland.github.io/regenesis-labs-transparency/roadmap.json';

export type RoadmapStatus = 'done' | 'in-progress' | 'not-started';

export interface RoadmapItem {
  id: number;
  emoji: string;
  title: string;
  status: RoadmapStatus;
  progress: number;
  priority?: string;
  phase?: string;
}

export interface RoadmapData {
  lastUpdated: string;
  items: RoadmapItem[];
}

async function fetchRoadmapData(): Promise<RoadmapData> {
  const response = await fetch(ROADMAP_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch roadmap data: ${response.statusText}`);
  }
  return response.json();
}

export function useRoadmapData() {
  return useQuery({
    queryKey: ['roadmapData'],
    queryFn: fetchRoadmapData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
