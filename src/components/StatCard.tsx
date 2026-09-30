interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
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
    <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 transition-all duration-200 hover:border-[#1d1d1f]/30 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[#7a7a7a] tracking-tight uppercase">
            {title}
          </p>
          <p className="text-[34px] font-semibold text-[#1d1d1f] tracking-tight leading-tight mt-1.5 font-sans">
            {value}
          </p>
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] shrink-0 border border-[#e0e0e0]">
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend || badge) && (
        <div className="mt-4 pt-3 border-t border-[#f0f0f0] flex items-center justify-between text-[13px] text-[#7a7a7a]">
          {subtitle && <span className="truncate">{subtitle}</span>}
          {trend && (
            <span className="font-medium text-[#0066cc] bg-[#f5f5f7] px-2.5 py-0.5 rounded-full text-xs shrink-0 border border-[#e0e0e0]">
              {trend}
            </span>
          )}
          {badge && (
            <span className="font-medium text-[#1d1d1f] bg-[#f5f5f7] px-2.5 py-0.5 rounded-full text-xs shrink-0">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
