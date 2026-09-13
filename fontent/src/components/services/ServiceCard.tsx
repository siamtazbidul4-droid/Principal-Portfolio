import React from 'react';
import { Layers, LayoutDashboard, ShoppingBag, Sparkles, Server, Cpu, Check, ArrowRight } from 'lucide-react';
import { IService } from '../../types';
import { Link } from 'react-router-dom';

const iconMap: Record<string, React.ReactNode> = {
  Layers: <Layers className="w-5 h-5 text-[#C9A769]" />,
  LayoutDashboard: <LayoutDashboard className="w-5 h-5 text-[#C9A769]" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5 text-[#C9A769]" />,
  Sparkles: <Sparkles className="w-5 h-5 text-[#C9A769]" />,
  Server: <Server className="w-5 h-5 text-[#C9A769]" />,
  Cpu: <Cpu className="w-5 h-5 text-[#C9A769]" />,
};

interface ServiceCardProps {
  key?: React.Key;
  service: IService;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const icon = iconMap[service.icon] || <Server className="w-5 h-5 text-[#C9A769]" />;

  return (
    <div
      id={`service-card-${index}`}
      className="group p-8 bg-[#0D0D0D] border border-[#242424] hover:border-[#C9A769]/50 transition-all duration-300 rounded-sm flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1E1E1E]">
          <div className="p-3 bg-[#141414] border border-[#262626] rounded-sm group-hover:border-[#C9A769]/40 transition-colors">
            {icon}
          </div>
          <span className="font-mono text-xs text-[#666662]">0{index + 1}</span>
        </div>

        <h3 className="text-xl font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] group-hover:text-[#FFFFFF] transition-colors">
          {service.title}
        </h3>

        <p className="mt-3 text-sm text-[#969691] leading-relaxed">
          {service.shortDescription}
        </p>

        {/* Features Checklist */}
        <div className="mt-6 pt-5 border-t border-[#1A1A1A]">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#666662] mb-3">
            Core Capabilities
          </h4>
          <ul className="space-y-2">
            {service.features.map((feature, fIdx) => (
              <li key={fIdx} className="flex items-start gap-2.5 text-xs text-[#C5C5C0]">
                <Check className="w-3.5 h-3.5 text-[#C9A769] shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-[#1A1A1A] flex items-center justify-between">
        <span className="text-[11px] font-mono text-[#666662] uppercase tracking-wider">
          Enterprise Quality
        </span>
        <Link
          to="/contact"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#C9A769] hover:text-[#D4B77C] font-semibold transition-colors"
        >
          <span>INQUIRE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
