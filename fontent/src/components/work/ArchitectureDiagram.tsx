import React from 'react';
import { ArrowRight, Server, Database, Layers, Monitor, ShieldCheck } from 'lucide-react';
import { IProjectArchitecture } from '../../types';

interface ArchitectureDiagramProps {
  architecture: IProjectArchitecture;
}

export function ArchitectureDiagram({ architecture }: ArchitectureDiagramProps) {
  const steps = [
    {
      title: 'Client Layer',
      desc: architecture.client,
      icon: <Monitor className="w-4 h-4 text-[#C9A769]" />,
    },
    {
      title: 'API Gateway',
      desc: architecture.api,
      icon: <Server className="w-4 h-4 text-[#C9A769]" />,
    },
    {
      title: 'Domain & Validation',
      desc: architecture.serviceLayer,
      icon: <ShieldCheck className="w-4 h-4 text-[#C9A769]" />,
    },
    {
      title: 'Persistence Store',
      desc: architecture.database,
      icon: <Database className="w-4 h-4 text-[#C9A769]" />,
    },
  ];

  return (
    <div className="p-6 sm:p-8 bg-[#0B0B0B] border border-[#242424] rounded-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C9A769]">
          <Layers className="w-4 h-4" />
          <span>Verified System Architecture</span>
        </div>
        <span className="text-xs font-mono text-[#666662]">End-to-End Data Pipeline</span>
      </div>

      {/* Visual Flow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => (
          <div
            key={step.title}
            className="p-4 bg-[#121212] border border-[#202020] rounded-sm flex flex-col justify-between relative"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-[#1A1A1A] border border-[#262626] rounded-sm">
                  {step.icon}
                </div>
                <span className="font-mono text-[10px] text-[#666662]">0{idx + 1}</span>
              </div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#E2E2DE] font-semibold mb-1">
                {step.title}
              </h4>
              <p className="text-xs text-[#969691] leading-relaxed">
                {step.desc}
              </p>
            </div>

            {idx < steps.length - 1 && (
              <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#2E2E2E] items-center justify-center text-[#969691]">
                <ArrowRight className="w-3 h-3 text-[#C9A769]" />
              </div>
            )}
          </div>
        ))}
      </div>

      {architecture.diagramSummary && (
        <div className="mt-6 p-3 bg-[#101010] border border-[#1A1A1A] rounded-sm font-mono text-xs text-[#8A8A85] flex items-center justify-between">
          <span className="text-[#666662]">Summary Protocol:</span>
          <span className="text-[#C9A769] font-medium">{architecture.diagramSummary}</span>
        </div>
      )}
    </div>
  );
}
