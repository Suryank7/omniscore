"use client";

import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  grade?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function ScoreGauge({
  score,
  grade,
  label,
  size = "md",
}: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [score]);

  const getColor = (val: number) => {
    if (val >= 80) return "#10B981"; // Emerald
    if (val >= 60) return "#F59E0B"; // Amber
    if (val >= 40) return "#F97316"; // Orange
    return "#EF4444"; // Crimson
  };

  const currentColor = getColor(score);

  const dimensions = {
    sm: { box: 100, radius: 40, stroke: 5, fontSize: "text-2xl" },
    md: { box: 140, radius: 58, stroke: 7, fontSize: "text-4xl" },
    lg: { box: 180, radius: 76, stroke: 9, fontSize: "text-5xl" },
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const strokeDashoffset = circumference - (circumference * animatedScore) / 100;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: dimensions.box, height: dimensions.box }}>
        <svg
          className="score-ring w-full h-full"
          viewBox={`0 0 ${dimensions.box} ${dimensions.box}`}
        >
          <circle
            cx={dimensions.box / 2}
            cy={dimensions.box / 2}
            r={dimensions.radius}
            stroke="rgba(74, 111, 165, 0.15)"
            strokeWidth={dimensions.stroke}
            fill="none"
          />
          <circle
            cx={dimensions.box / 2}
            cy={dimensions.box / 2}
            r={dimensions.radius}
            stroke={currentColor}
            strokeWidth={dimensions.stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`${dimensions.fontSize} font-extrabold tracking-tight`}
            style={{ color: currentColor }}
          >
            {animatedScore}
          </span>
          <span className="text-[11px] text-slate-400 font-medium -mt-1">OUT OF 100</span>
        </div>
      </div>

      {(grade || label) && (
        <div className="text-center mt-2">
          {grade && (
            <span
              className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-1"
              style={{ background: `${currentColor}20`, color: currentColor }}
            >
              Grade {grade}
            </span>
          )}
          {label && <p className="text-xs text-slate-300 font-medium">{label}</p>}
        </div>
      )}
    </div>
  );
}
