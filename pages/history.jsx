import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Head from "next/head";
import transactionService from "../api/transaction.service";
import HistoryTable from "../components/tables/history";

function History() {
  const [transactions, setTransactions] = useState([]);
  console.log(transactions);
  useEffect(() => {
    transactionService.getAll().then((res) => {
      setTransactions(res.data);
    });
  }, []);

  return (
    <div>
      <Head>
        <title>Coindraw Admin | History </title>
        <meta name="description" content="Coindraw Administration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title="History">
        <HistoryTable transactions={transactions} />
      </Layout>
    </div>
  );
}

export default History;
