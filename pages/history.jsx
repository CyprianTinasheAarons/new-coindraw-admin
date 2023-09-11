import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Head from "next/head";
import { useDispatch } from "react-redux";
import HistoryTable from "../components/tables/history";
import { getTransactions } from "../slices/transactions";

function History() {
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState([]);
  const getData = async () => {
    const res = await dispatch(getTransactions()).unwrap();
    setTransactions(res);
  };

  useEffect(() => {
    getData(); // Fetch transactions immediately on component mount
    const interval = setInterval(() => {
      getData();
    }, 300000); // Fetches transactions every 5 minutes
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [dispatch]);
  return (
    <div>
      <Head>
        <title>Coindraw Admin | History </title>
        <meta name="description" content="Coindraw Administration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title="History">
        <HistoryTable data={transactions} />
      </Layout>
    </div>
  );
}

export default History;
