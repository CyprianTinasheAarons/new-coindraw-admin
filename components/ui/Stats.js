
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Stats({user, transactions}) {
  const stats = [
    {
      name: "Total Amount Due",
      value: user?.referrerReward,
    },
    {
      name: "Total Amount Paid",
      value: user?.referrerTotalReward,
    },
    {
      name: "Total Payouts",
      value: transactions?.length,
    },
    {
      name: "Total Referrals",
      value: user?.referrerCount,
    },
  ];


   const options = {
     responsive: true,
     plugins: {
       legend: {
         position: "top",
       },
       title: {
         display: true,
         text: "Monthly Payouts",
       },
     },
   };

   const labels = transactions.map(transaction => new Date(transaction.createdAt).toLocaleDateString());

   const data = {
     labels,
     datasets: [
       {
         label: "Payouts",
         data: transactions.map(transaction => transaction.amount),
         borderColor: "rgb(0, 255, 0)",
         backgroundColor: "rgba(0, 255, 0, 0.5)",
       },
     ],
   };

  
  return (
    <>
      {/* Line Graph */}
      <Line options={options} data={data} />

      {/* Stats */}
      <dl className="grid grid-cols-1 gap-px p-8 m-8 mx-auto border rounded-md bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="flex flex-wrap items-baseline justify-between px-4 py-10 bg-white gap-x-4 gap-y-2 sm:px-6 xl:px-8"
          >
            <dt className="text-sm font-medium leading-6 text-gray-500">
              {stat.name}
            </dt>
            <dd className="flex items-baseline justify-end text-2xl font-semibold text-gray-900">
              {stat.value}
            </dd>
       
          </div>
        ))}
      </dl>
    </>
  );
}
