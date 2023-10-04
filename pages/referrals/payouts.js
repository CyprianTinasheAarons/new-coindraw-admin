import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import Layout from "../../components/ui/Layout";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
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
          const filteredTransactions = res.filter(
            (transaction) => transaction.email === userEmail
          );
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
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Last 30 days
          </h3>
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
        <TableContainer>
          <Table variant="simple">
            <TableCaption>Transaction History</TableCaption>
            <Thead>
              <Tr>
                <Th>Transaction Hash</Th>
                <Th>Type</Th>
                <Th>Amount</Th>
                <Th>Date</Th>
                <Th>Receipt</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((transaction) => (
                <Tr key={transaction.transactionHash}>
                  <Td>{transaction.transactionHash}</Td>
                  <Td>{transaction.transactionType}</Td>
                  <Td isNumeric>{transaction.transactionAmount}</Td>
                  <Td>{transaction.transactionDate}</Td>
                  <Td>
                    <a href={transaction.receiptUrl}>View Receipt</a>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Layout>
    </div>
  );
}

export default Referrals;
