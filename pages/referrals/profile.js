import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import Layout from "../../components/ui/Layout";
import MyProfile from "../../components/ui/MyProfile";

function Profile() {
  return (
    <div>
      <Head>
        <title>Coindraw Admin | Profile</title>
        <meta name="description" content="Coindraw Administration | Profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title={"My Profile"}>
        <MyProfile />
      </Layout>
    </div>
  );
}

export default Profile;
