import Head from "next/head";
import Layout from "../components/Layout";
import BoxesTable from "../components/tables/boxes";

function Draws() {
  return (
    <div>
      <Head>
        <title>Coindraw Admin | Draws </title>
        <meta name="description" content="Coindraw Administration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-full bg-white">
        <Layout title="Coinbox">
          <a
            href="/configure/classic"
            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Configure Classic Box
          </a>
          <a
            href="/configure/exclusive"
            className="inline-flex items-center px-3 py-2 ml-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Configure Exclusive Box
          </a>

          <BoxesTable />
        </Layout>
      </main>
    </div>
  );
}

export default Draws;
