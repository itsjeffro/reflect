export type EntryRequest = {
  title?: string;
  content?: string;
  published_at: string;
}

export type EntryResponse = {
  id: number;
  title: string | null;
  content: string | null;
  published_at: string;
}