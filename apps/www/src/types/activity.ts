export interface ActivityMedia {
  id: number;
  activity_id: number;
  media_type: 'image' | 'video';
  media_url: string;
  display_order: number | null;
}

export interface Activity {
  id: number;
  title: string | null;
  description: string | null;
  category: string | null;
  date: string | null;
  image_url: string | null;
  generation_id: number | null;
  activity_media?: ActivityMedia[];
}
