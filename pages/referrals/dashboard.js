import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import Layout from "../../components/ui/Layout";
import Stats from "../../components/ui/Stats";

function Dashboard() {
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
        <Stats />
      </Layout>
    </div>
  );
}

export default Dashboard;
