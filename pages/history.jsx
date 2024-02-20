import Layout from "../components/Layout";
import Head from "next/head";

import HistoryTable from "../components/tables/history";

function History() {
  return (
    <div>
      <Head>
        <title>Coindraw Admin | History </title>
        <meta name="description" content="Coindraw Administration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title="History">
        <HistoryTable />
      </Layout>
    </div>
  );
}

export default History;
