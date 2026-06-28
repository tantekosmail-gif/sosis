"use client";

import { Group } from "@visx/group";
import { Wordcloud } from "@visx/wordcloud";
import { scaleOrdinal } from "d3-scale";

type WordData = {
  keyword: string;
  total: number;
};

interface Props {
  data: WordData[];
  width?: number;
  height?: number;
}

const colors = scaleOrdinal([
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#9333ea",
  "#ea580c",
  "#0891b2",
]);

export default function WordCloud({ data, width = 800, height = 450 }: Props) {
  const words = data.map((item) => ({
    text: item.keyword,
    value: item.total,
  }));

  return (
    <div className="w-full border rounded-xl bg-white">
      <svg width={width} height={height}>
        <Wordcloud
          words={words}
          width={width}
          height={height}
          font="Inter"
          fontSize={(word) => 12 + word.value * 2}
          padding={8}
          spiral="archimedean"
          rotate={() => 0}
          random={Math.random}
        >
          {(cloudWords) => (
            <Group top={height / 2} left={width / 2}>
              {cloudWords.map((word, i) => (
                <text
                  key={word.text}
                  transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
                  textAnchor="middle"
                  fontSize={word.size}
                  fontFamily={word.font}
                  fill={colors(String(i))}
                  style={{
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  {word.text}
                </text>
              ))}
            </Group>
          )}
        </Wordcloud>
      </svg>
    </div>
  );
}
