#!/usr/bin/env tsx
/**
 * Fetch roadmap data from a Notion database and write to data/roadmap.json
 *
 * Requires NOTION_TOKEN environment variable (a Notion integration token
 * with read access to the database).
 *
 * Usage: NOTION_TOKEN=ntn_xxx npx tsx scripts/notion/fetch-roadmap.ts
 */

import { Client, isFullPage, collectPaginatedAPI } from '@notionhq/client';
import { writeDataFile } from '../lib/output.js';
import { NOTION_DATABASE_ID, PROPERTY_MAP, STATUS_MAP } from './config.js';
import type {
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints.js';

type RoadmapStatus = 'done' | 'in-progress' | 'not-started';

interface RoadmapItem {
  id: number;
  emoji: string;
  title: string;
  status: RoadmapStatus;
  progress: number;
  priority?: string;
  phase?: string;
}

interface RoadmapData {
  lastUpdated: string;
  items: RoadmapItem[];
}

// --- Helpers for extracting Notion property values ---

function getTitle(page: PageObjectResponse): string {
  const prop = page.properties[PROPERTY_MAP.title];
  if (prop?.type === 'title') {
    return prop.title.map((t: RichTextItemResponse) => t.plain_text).join('');
  }
  return '';
}

function getStatus(page: PageObjectResponse): RoadmapStatus {
  const prop = page.properties[PROPERTY_MAP.status];
  if (prop?.type === 'status' && prop.status?.name) {
    return STATUS_MAP[prop.status.name] ?? 'not-started';
  }
  if (prop?.type === 'select' && prop.select?.name) {
    return STATUS_MAP[prop.select.name] ?? 'not-started';
  }
  return 'not-started';
}

function getProgress(page: PageObjectResponse): number {
  const prop = page.properties[PROPERTY_MAP.progress];
  // Rollup returns 0-1 ratio, convert to 0-100 percentage
  if (prop?.type === 'rollup' && prop.rollup?.type === 'number' && prop.rollup.number !== null) {
    return Math.round(prop.rollup.number * 100);
  }
  // Fallback for plain number property
  if (prop?.type === 'number' && prop.number !== null) {
    return Math.round(prop.number);
  }
  return 0;
}

function getSelect(page: PageObjectResponse, propertyName: string): string {
  const prop = page.properties[propertyName];
  if (prop?.type === 'select' && prop.select?.name) {
    return prop.select.name;
  }
  return '';
}

function isTopLevelItem(page: PageObjectResponse): boolean {
  const prop = page.properties[PROPERTY_MAP.parentItem];
  return prop?.type === 'relation' && prop.relation.length === 0;
}

function getEmoji(page: PageObjectResponse): string {
  if (page.icon?.type === 'emoji') {
    return page.icon.emoji;
  }
  return '📌';
}

// --- Main ---

async function main() {
  const notionToken = process.env.NOTION_TOKEN;
  if (!notionToken) {
    throw new Error(
      'NOTION_TOKEN environment variable is required.\n' +
      'Create a Notion integration at https://www.notion.so/my-integrations\n' +
      'and share the database with it.'
    );
  }

  console.log('📋 Fetching roadmap data from Notion...');

  const notion = new Client({ auth: notionToken });

  // Query all pages from the database (handles pagination automatically)
  const results = await collectPaginatedAPI(
    notion.dataSources.query,
    { data_source_id: NOTION_DATABASE_ID }
  );
  const allPages = results.filter(isFullPage) as PageObjectResponse[];

  // Only keep top-level initiatives (no parent item)
  const pages = allPages.filter(isTopLevelItem);

  console.log(`   Found ${allPages.length} total items, ${pages.length} top-level initiatives`);

  // Transform Notion pages to RoadmapItems
  const items: RoadmapItem[] = pages.map((page) => {
    const priority = getSelect(page, PROPERTY_MAP.priority);
    const phase = getSelect(page, PROPERTY_MAP.phase);

    return {
      id: 0, // assigned after sorting
      emoji: getEmoji(page),
      title: getTitle(page),
      status: getStatus(page),
      progress: getProgress(page),
      ...(priority ? { priority } : {}),
      ...(phase ? { phase } : {}),
    };
  });

  // Sort by phase number (Phase 0, 1, 2, ...), items without a phase go last
  items.sort((a, b) => {
    const phaseNum = (phase?: string) => {
      if (!phase) return Infinity;
      const match = phase.match(/Phase\s+(\d+)/);
      return match ? parseInt(match[1], 10) : Infinity;
    };
    return phaseNum(a.phase) - phaseNum(b.phase);
  });

  // Assign IDs after sorting
  items.forEach((item, i) => { item.id = i + 1; });

  // Log summary
  const doneCount = items.filter((i) => i.status === 'done').length;
  const inProgressCount = items.filter((i) => i.status === 'in-progress').length;
  const notStartedCount = items.filter((i) => i.status === 'not-started').length;
  console.log(`   Done: ${doneCount}, In Progress: ${inProgressCount}, Not Started: ${notStartedCount}`);

  const data: RoadmapData = {
    lastUpdated: new Date().toISOString(),
    items,
  };

  writeDataFile('roadmap.json', data);
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
