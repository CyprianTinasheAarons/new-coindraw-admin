import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import Layout from "../../components/ui/Layout";

import { getReferral } from "../../slices/referral";
import { getTransactions } from "../../slices/transactions";

function Referrals() {

    const dispatch = useDispatch();
    const [refferer, setRefferer] = useState({});
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
      const id = JSON.parse(localStorage.getItem("user-coindraw"))?.id;
      dispatch(getReferral(id))
        .unwrap()
        .then((res) => {
          console.log(res);
          setRefferer(res);
        });
    }, []);

    useEffect(() => {
      dispatch(getTransactions())
        .unwrap()
        .then((res) => {
          const userEmail = JSON.parse(
            localStorage.getItem("user-coindraw")
          )?.email;
          const filteredTransactions = res
            .filter((transaction) => transaction.email === userEmail)
            .filter(t => ["Paypal", "Fiat", "Crypto(MATIC)"].includes(t.type));
          setTransactions(filteredTransactions);
        });
    }, []);

    const stats = [
      { name: "Amount Due", stat: refferer?.referrerReward + " MATIC" },
      { name: "Total Amount", stat: refferer?.referrerTotalReward + " MATIC" },
      { name: "Total Payouts", stat: refferer?.referrerCount },
    ];



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
      <Layout title={"Payouts"}>
        {/* Buttons */}
        <div className="p-8 ">
        
          <dl className="grid grid-cols-1 gap-5 mt-5 sm:grid-cols-3">
            {stats.map((item) => (
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
              </div>
            ))}
          </dl>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Email
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
              >
                Transaction
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Receipt URL
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {transactions?.map((t) => (
              <tr key={t?.id}>
                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {t?.email}
                </td>
                <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                  {t?.transactionHash
                    ? t?.transactionHash?.substring(0, 20) + "..."
                    : "No hash"}
                  {t?.transactionHash && (
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          t?.transactionHash ? t?.transactionHash : "No hash"
                        )
                      }
                      className="px-2 py-1 ml-2 text-xs text-white bg-blue-500 rounded"
                    >
                      Copy
                    </button>
                  )}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {t?.type}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {t?.amount}
                </td>
                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {new Date(t?.createdAt).toLocaleDateString()}
                </td>

                <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
           
                    <a
                      href={t?.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline uppercase text-green"
                    >
                      View Receipt
                    </a>
             
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Layout>
    </div>
  );
}

export default Referrals;
