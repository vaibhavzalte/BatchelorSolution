"use client";

export default function SkeletonCard() {
  return (
    <div className="bg-white p-2 rounded-[2rem] border border-gray-100 overflow-hidden flex flex-col h-[550px] animate-pulse">
      {/* Media placeholder */}
      <div className="relative h-56 bg-gray-200 rounded-2xl overflow-hidden" />
      
      {/* Content placeholder */}
      <div className="p-6 flex flex-col gap-6 mt-5 flex-1 justify-between">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded-xl w-3/4" />
          <div className="flex gap-4">
            <div className="h-8 bg-gray-100 rounded-lg w-20" />
            <div className="h-8 bg-gray-100 rounded-lg w-20" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="h-4 bg-gray-100 rounded-lg w-1/4" />
          <div className="h-10 bg-gray-200 rounded-xl w-full" />
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded-lg w-1/3" />
          <div className="h-8 bg-gray-100 rounded-lg w-full" />
        </div>

        <div className="pt-6 border-t border-gray-50 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-gray-200 rounded-md w-1/4" />
              <div className="h-4 bg-gray-200 rounded-md w-1/2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
