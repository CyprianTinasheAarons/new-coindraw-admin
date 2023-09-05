import {
  ChartBarIcon,
  ClockIcon,
  UsersIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

import drawService from "../api/draw.service";
import transactionService from "../api/transaction.service";
import UserService from "../api/user.service";
import WinnerService from "../api/winner.service";
import { useEffect, useState } from "react";

export default function Stats() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDraws, setTotalDraws] = useState(0);
  const [totalWinners, setTotalWinners] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  useEffect(() => {
    UserService.getAll().then((response) => {
      setTotalUsers(response.data.length);
    });
    drawService.getAll().then((response) => {
      setTotalDraws(response.data.length);
    });
    WinnerService.getAll().then((response) => {
      setTotalWinners(response.data.length);
    });
    transactionService.getAll().then((response) => {
      setTotalTransactions(response.data.length);
    });
  }, [totalUsers, totalTransactions, totalWinners]);

  const stats = [
    {
      id: 1,
      name: "Total Users",
      stat: totalUsers,
      icon: UsersIcon,
      href: "/users",
    },
    {
      id: 2,
      name: "History Events",
      stat: totalTransactions,
      icon: ClockIcon,
      href: "/history",
    },
    {
      id: 3,
      name: "Draws",
      stat: totalDraws,
      icon: ChartBarIcon,
      href: "/draws",
    },
    {
      id: 4,
      name: "Winners",
      stat: totalWinners,
      icon: HandThumbUpIcon,
      href: "/winners",
    },
  ];

  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        Overall Statistics
      </h3>

      <dl className="grid grid-cols-1 gap-5 mt-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative px-4 pt-5 pb-12 overflow-hidden bg-white border-2 rounded-lg shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute p-3 rounded-md bg-green">
                <item.icon className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                {item.name}
              </p>
            </dt>
            <dd className="flex items-baseline pb-6 ml-16 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {item.stat}
              </p>

              <div className="absolute inset-x-0 bottom-0 px-4 py-4 bg-[#101422] sm:px-6">
                <div className="flex justify-center text-sm">
                  <a
                    href={item.href}
                    className="font-medium text-center text-white hover:text-white"
                  >
                    {" "}
                    View all<span className="sr-only"> {item.name} stats</span>
                  </a>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
