import type { ComponentType } from 'react';

type Props = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
};

export default function ComingSoon({ icon: Icon, title, description }: Props) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        {description && <p className="text-slate-500 text-sm mt-0.5">{description}</p>}
      </div>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5">
          <Icon className="h-8 w-8 text-indigo-500" />
        </div>
        <h2 className="text-lg font-semibold text-slate-700 mb-1.5">Coming Soon</h2>
        <p className="text-slate-400 text-sm max-w-sm">
          This module is part of the HRM suite and will be available in a future update.
        </p>
      </div>
    </div>
  );
}
