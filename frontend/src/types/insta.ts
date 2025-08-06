export interface InstaPost {
  id: string;
  instagram_id: string;
  media_url: string | null;
  caption: string | null;
  timestamp: string | null;
  is_synced: boolean;
  created_at: string;
  updated_at: string;
  media_type: string | null;
  permalink: string | null;
}
export interface Stats {
  total: number;
  synced: number;
  unsynced: number;
}

export interface FilterProps {
  filter: "all" | "synced" | "unsynced";
  setFilter: React.Dispatch<
    React.SetStateAction<"all" | "synced" | "unsynced">
  >;
  stats: Stats;
}

export interface PostListProps {
  posts: InstaPost[];
  filter: "all" | "synced" | "unsynced";
  handleSync: (postId: string) => void;
  formatDate: (dateString: string | null) => string;
}
export interface PostItemProps {
  post: InstaPost;
  handleSync: (postId: string) => void;
  formatDate: (dateString: string | null) => string;
  filter: "all" | "synced" | "unsynced";
}
