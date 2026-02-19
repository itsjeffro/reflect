import type { TagModel } from "./tag.types";

export type EntryRequest = {
  title?: string | null;
  content?: string | null;
  published_at: string | null;
  updated_at?: string | null;
}

export type EntryModel = {
  id: number;
  title: string | null;
  content: string | null;
  tags: TagModel[];
  published_at: string;
  created_at: string | null;
  updated_at: string | null;
}