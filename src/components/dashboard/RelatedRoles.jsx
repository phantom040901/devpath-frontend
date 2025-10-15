// src/components/dashboard/RelatedRoles.jsx
import React from "react";

export default function RelatedRoles({ roles = [] }) {
  return (
    <div className="flex flex-col gap-2">
      {roles.map((r) => (
        <div key={r} className="flex items-center justify-between rounded-md bg-primary-1300 px-3 py-2">
          <div className="text-sm text-primary-50">{r}</div>
          <div className="text-xs text-primary-200">Explore</div>
        </div>
      ))}
    </div>
  );
}
