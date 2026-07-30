"use client";

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface RadarChartProps {
  data: {
    subject: string;
    score: number;
    fullMark: number;
  }[];
}

export default function RadarChart({ data }: RadarChartProps) {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="rgba(74, 111, 165, 0.2)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#64748B", fontSize: 9 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.3}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
