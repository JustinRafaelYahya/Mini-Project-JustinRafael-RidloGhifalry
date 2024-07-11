import Chart from './_components/chart';
import LifeTime from './_components/life-time';

export default async function DashboardPage() {
  return (
    <div className="w-full max-w-7xl container mx-auto my-20 p-4">
      <Chart />
      <hr className="my-32" />
      <LifeTime />
    </div>
  );
}
