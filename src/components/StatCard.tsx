import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  subtitle?: string;
  trend?: string;
  badge?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  badge,
}: StatCardProps) {
  return (
    <div className="bg-[#ffffff] rounded-[18px] border border-[#e0e0e0] p-[24px] flex flex-col justify-between h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-[#7a7a7a] uppercase tracking-[-0.224px]">
            {title}
          </p>
          <p className="text-[34px] font-semibold text-[#1d1d1f] leading-[1.47] tracking-[-0.374px] mt-1 truncate">
            {value}
          </p>
        </div>
        {icon && (
          <div className="w-11 h-11 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] shrink-0 border border-[#e0e0e0]">
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend || badge) && (
        <div className="mt-[24px] pt-[16px] border-t border-[#f0f0f0] flex items-center justify-between text-[14px] text-[#7a7a7a]">
          {subtitle && <span className="truncate">{subtitle}</span>}
          {trend && (
            <span className="font-semibold text-[#0066cc] bg-[#f5f5f7] px-[12px] py-[4px] rounded-full text-[12px] tracking-tight shrink-0 border border-[#e0e0e0]">
              {trend}
            </span>
          )}
          {badge && (
            <span className="font-semibold text-[#1d1d1f] bg-[#f5f5f7] px-[12px] py-[4px] rounded-full text-[12px] shrink-0 border border-[#e0e0e0]">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
