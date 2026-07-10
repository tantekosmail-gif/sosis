export interface GeoPlace {
  place: string;
  lat: number;
  lng: number;
  total_mentions: number;
  from_posts: number;
  from_comments: number;
}

export interface GeoDistributionData {
  date_from: string;
  date_to: string;
  platform: string;
  total_places_checked: number;
  total_places_matched: number;
  places: GeoPlace[];
}
