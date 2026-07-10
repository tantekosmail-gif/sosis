"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

import type { GeoPlace } from "@/features/trends/types/geoDistribution.types";

const MIN_RADIUS = 8;
const MAX_RADIUS = 26;
const ACCENT_COLOR = "#6366f1";

function radiusFor(mentions: number, maxMentions: number) {
  if (maxMentions <= 0) return MIN_RADIUS;
  const ratio = Math.sqrt(mentions / maxMentions);
  return MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * ratio;
}

interface Props {
  places: GeoPlace[];
}

export default function LocationMapLeaflet({ places }: Props) {
  const maxMentions = places.reduce((max, p) => Math.max(max, p.total_mentions), 0);
  const bounds: [number, number][] = places.map((p) => [p.lat, p.lng]);

  return (
    <MapContainer
      bounds={bounds.length > 0 ? bounds : undefined}
      boundsOptions={{ padding: [32, 32], maxZoom: 6 }}
      center={bounds.length === 0 ? [-2.5, 118] : undefined}
      zoom={bounds.length === 0 ? 4 : undefined}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ background: "#f8fafc" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {places.map((place) => (
        <CircleMarker
          key={place.place}
          center={[place.lat, place.lng]}
          radius={radiusFor(place.total_mentions, maxMentions)}
          pathOptions={{
            color: ACCENT_COLOR,
            weight: 1.5,
            fillColor: ACCENT_COLOR,
            fillOpacity: 0.45,
          }}
        >
          <Tooltip direction="top" offset={[0, -4]}>
            <div className="text-xs">
              <p className="font-semibold text-slate-800 dark:text-slate-200">{place.place}</p>
              <p className="text-slate-600 dark:text-slate-400">{place.total_mentions} mentions</p>
              <p className="text-slate-400 dark:text-slate-500">{place.from_posts} post &middot; {place.from_comments} komentar</p>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
