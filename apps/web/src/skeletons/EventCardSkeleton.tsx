export default function EventCardSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from([1, 2, 3, 4]).map((index) => (
        <div key={index} className="space-y-2">
          <div className="w-full h-[150px] bg-slate-300 rounded-md animate-pulse" />
          <div className="w-1/2 h-[20px] bg-slate-300 rounded-md animate-pulse" />
          <div className="w-1/2 h-[20px] bg-slate-300 rounded-md animate-pulse" />
        </div>
      ))}
    </div>
  );
}
