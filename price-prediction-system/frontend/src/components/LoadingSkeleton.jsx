import React from 'react';

export function CardSkeleton() {
  return (
    <div className="pro-card rounded-2xl p-5 space-y-4 animate-pulse">
      <div className="h-44 bg-white/[0.04] rounded-xl w-full" />
      <div className="space-y-2">
        <div className="h-4 bg-white/[0.06] rounded w-3/4" />
        <div className="h-3 bg-white/[0.04] rounded w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-white/[0.08] rounded w-24" />
        <div className="h-8 bg-white/[0.06] rounded-xl w-24" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-white/[0.04]">
      <td className="py-4 px-4"><div className="h-4 bg-white/[0.05] rounded w-36" /></td>
      <td className="py-4 px-4"><div className="h-4 bg-white/[0.05] rounded w-20" /></td>
      <td className="py-4 px-4"><div className="h-4 bg-white/[0.05] rounded w-24" /></td>
      <td className="py-4 px-4"><div className="h-4 bg-white/[0.05] rounded w-20" /></td>
      <td className="py-4 px-4"><div className="h-7 bg-white/[0.05] rounded-lg w-20" /></td>
    </tr>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="pro-card rounded-2xl p-6 h-48 bg-white/[0.03]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="pro-card rounded-2xl p-5 h-36 bg-white/[0.03]" />
        <div className="pro-card rounded-2xl p-5 h-36 bg-white/[0.03]" />
        <div className="pro-card rounded-2xl p-5 h-36 bg-white/[0.03]" />
      </div>
      <div className="pro-card rounded-2xl p-6 h-80 bg-white/[0.03]" />
    </div>
  );
}
