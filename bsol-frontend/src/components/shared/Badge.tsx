"use client";

interface BadgeProps {
  label: string;
  color: string;
}

export default function Badge({ label, color }: BadgeProps) {
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md ${color}`}>
      {label}
    </span>
  );
}
