import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import Layout from "../../components/ui/Layout";
import { useToast } from "@chakra-ui/react";

const stats = [
  { name: "Current Code", stat: "7fsa897", button: "Request New Code" },
  { name: "Expiry Date", stat: "10/12/32", button: "Request Date Extention" },
  { name: "Pending Payout", stat: "230 MATIC", button: "Request Payout" },
];

function Referrals() {
  const toast = useToast();
  return (
    <div>
      <Head>
        <title>Coindraw Admin | Referrals</title>
        <meta
          name="description"
          content="Coindraw Administration | Referrals"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title={"Requests"}>
        {/* Buttons */}
        <div className="p-8 ">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Last 30 days
          </h3>
          <dl className="grid grid-cols-1 gap-5 mt-5 sm:grid-cols-3">
            {stats.map((item, index) => (
              <div
                key={item.name}
                className="px-4 py-5 overflow-hidden bg-white border rounded-lg shadow sm:p-6"
              >
                <dt className="text-lg font-medium uppercase truncate text-green">
                  {item.name}
                </dt>
                <dd className="mt-1 mb-4 text-3xl font-semibold tracking-tight text-gray-900">
                  {item.stat}
                </dd>
                {index === 0 && (
                  <button className="p-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {item.button}
                  </button>
                )}
                {index === 1 && (
                  <button className="p-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {item.button}
                  </button>
                )}
                {index === 2 && (
                  <button className="p-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {item.button}
                  </button>
                )}
              </div>
            ))}
          </dl>
        </div>
      </Layout>
    </div>
  );
}

export default Referrals;
