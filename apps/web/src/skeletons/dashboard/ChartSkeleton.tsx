export default function ChartSkeleton() {
  return (
    <div className="w-full space-y-3">
      <div className="gap-6 flex items-center">
        <div className="w-[50px] h-[50px] rounded-md bg-slate-300 animate-pulse"></div>
        <div className="w-[50px] h-[50px] rounded-md bg-slate-300 animate-pulse"></div>
      </div>
      <div className="w-full h-[300px] bg-slate-300 rounded-md animate-pulse"></div>
    </div>
  );
}
