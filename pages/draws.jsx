import Head from "next/head";
import Layout from "../components/Layout";
import DrawsTable from "../components/tables/draws";

function Draws() {
  return (
    <div>
      <Head>
        <title>Coindraw Admin | Draws </title>
        <meta name="description" content="Coindraw Administration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-full bg-white">
        <Layout title="Draws">
          <a
            href="/adddraw"
            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Add Draw
          </a>

          <DrawsTable />
        </Layout>
      </main>
    </div>
  );
}

export default Draws;
