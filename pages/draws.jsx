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
            className="p-2 px-4 my-2 font-semibold text-center text-white rounded-md bg-green"
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
