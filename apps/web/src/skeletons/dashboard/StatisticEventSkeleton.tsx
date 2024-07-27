export default function StatisticEventSkeleton() {
  return (
    <div className="grid lg:grid-cols-4 gap-4">
      <div className="w-1/2 h-[50px] rounded-md bg-slate-300 animate-pulse"></div>
      <div className="col-span-2 w-full h-[150px] bg-slate-300 rounded-md animate-pulse"></div>
      <div className="w-1/2 h-[50px] rounded-md bg-slate-300 animate-pulse mx-auto"></div>
    </div>
  );
}
