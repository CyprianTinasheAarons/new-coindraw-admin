import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
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

const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const data = {
  labels,
  datasets: [
    {
      label: "Payouts",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 10000 })),
      borderColor: "rgb(0, 255, 0)",
      backgroundColor: "rgba(0, 255, 0, 0.5)",
    },
  ],
};

const stats = [
  {
    name: "Total Amount Due",
    value: "$405.00",
    change: "+4.75%",
    changeType: "positive",
  },
  {
    name: "Total Amount Paid",
    value: "$12.00",
    change: "+54.02%",
    changeType: "negative",
  },
  {
    name: "Total Payouts",
    value: "$245.00",
    change: "-1.39%",
    changeType: "positive",
  },
  {
    name: "Total Referrals",
    value: "$30.00",
    change: "+10.18%",
    changeType: "negative",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Stats() {
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
            <dd
              className={classNames(
                stat.changeType === "negative"
                  ? "text-rose-600"
                  : "text-gray-700",
                "text-xs font-medium"
              )}
            >
              {stat.change}
            </dd>
            <dd className="flex-none w-full text-3xl font-medium leading-10 tracking-tight text-gray-900">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
