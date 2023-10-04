import Head from "next/head";

import Layout from "../components/Layout";
import Stats from "../components/Stats";

export default function Home() {
  
  return (
    <div>
      <Head>
        <title>Coindraw Admin</title>
        <meta name="description" content="Coindraw Administration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full">
        <Layout>
          <Stats />
        </Layout>
      </main>
    </div>
  );
}
