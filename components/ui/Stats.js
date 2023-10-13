
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
import {useToast} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { getMaticPrice } from "../../slices/referral";
import { useEffect, useState } from "react";

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
  const toast = useToast();
  const [prices, setPrices] = useState({});
  const dispatch = useDispatch();
   const currencySymbols = {
     gbp: "£",
     usd: "$",
     eur: "€",
   };
   
  const stats = [
    {
      name: "Total Amount Due",
      value: user?.referrerReward,
    },
    {
      name: "Total Paid",
      value: user?.referrerTotalReward?.toFixed(2) + " MATIC/ " + currencySymbols[user?.payout?.currency] + "" + (user?.referrerTotalReward * prices?.[user?.payout?.currency])?.toFixed(3),
    },
    {
      name: "Total Payouts",
      value: transactions?.length
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

   const reversedTransactions = transactions.slice().reverse();
   const labels = reversedTransactions.map(transaction => new Date(transaction.createdAt).toLocaleDateString('en-GB'));

   const data = {
     labels,
     datasets: [
       {
         label: "Payouts",
         data: reversedTransactions.map(transaction => transaction.amount),
         borderColor: "rgb(0, 255, 0)",
         backgroundColor: "rgba(0, 255, 0, 0.5)",
       },
     ],
   };
   
    useEffect(() => {
 
         dispatch(getMaticPrice())
           .unwrap()
           .then((res) => {
             console.log(res);
             setPrices(res);
           });
       
     }, []);


  
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
            <dd className="flex items-baseline justify-end text-sm font-semibold text-gray-900">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Buttons to copy on clipboard */}
      <button
        className="px-8 py-3 border-2 rounded-md"
        onClick={() => {
          navigator.clipboard.writeText(user?.referralCode);
          toast({
            title: "Copied!",
            description: "Referral code copied to clipboard.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }}
      >
        Copy Referral Code
      </button>
      <button
        className="px-8 py-3 ml-4 border-2 rounded-md"
        onClick={() => {
          navigator.clipboard.writeText(user?.referralLink);
          toast({
            title: "Copied!",
            description: "Referral link copied to clipboard.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }}
      >
        Copy Referral Link
      </button>
    </>
  );
}
