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
    await dispatch(getTransactions())
      .unwrap()
      .then((res) => {
        setTransactions(res);
      });
  };

  useEffect(() => {
    getData();
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
