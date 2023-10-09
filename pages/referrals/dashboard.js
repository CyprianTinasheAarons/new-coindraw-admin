import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Head from "next/head";
import Layout from "../../components/ui/Layout";
import Stats from "../../components/ui/Stats";
import { getReferral } from "../../slices/referral";
import {getTransactions} from "../../slices/transactions";

function Dashboard() {
  const dispatch = useDispatch();
  const [refferer, setRefferer] = useState({});
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("user-coindraw"))?.id;
    dispatch(getReferral(id)).unwrap().then((res) => {
      console.log(res);
      setRefferer(res);
    }
    )
  }
  , []);

  useEffect(() => {
    dispatch(getTransactions()).unwrap().then((res) => {
      const userEmail = JSON.parse(localStorage.getItem("user-coindraw"))?.email;
      const filteredTransactions = res.filter(transaction => transaction.email == userEmail && transaction.email);
      setTransactions(filteredTransactions);

    }
    )
  }
  , []);


  return (
    <div>
      <Head>
        <title>Coindraw Admin | Dashboard</title>
        <meta
          name="description"
          content="Coindraw Administration | Dashboard"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title={"Referrals Dashboard"}>
        <Stats user={refferer} transactions={transactions}   />
      </Layout>
    </div>
  );
}

export default Dashboard;
