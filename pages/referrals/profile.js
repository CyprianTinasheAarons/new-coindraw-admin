import { useEffect, useState } from "react";
import { useDispatch} from "react-redux";
import Head from "next/head";
import Layout from "../../components/ui/Layout";
import MyProfile from "../../components/ui/MyProfile";
import { getReferral } from "../../slices/referral";


function Profile() {
   const dispatch = useDispatch();
   const [refferer, setRefferer] = useState(null);

   useEffect(() => {
     const id = JSON.parse(localStorage.getItem("user-coindraw"))?.id;
     dispatch(getReferral(id))
       .unwrap()
       .then((res) => {
         console.log(res);
         setRefferer(res);
       })
       .catch((error) => {
         console.error("Failed to fetch refferer: ", error);
       });
   }, [dispatch]);

   if (!refferer) {
     return <div>Loading...</div>;
   }

  return (
    <div>
      <Head>
        <title>Coindraw Admin | Profile</title>
        <meta name="description" content="Coindraw Administration | Profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title={"My Profile"}>
        <MyProfile user={refferer} />
      </Layout>
    </div>
  );
}

export default Profile;
