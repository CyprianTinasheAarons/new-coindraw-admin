import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Head from "next/head";
import Layout from "../../components/ui/Layout";
import { useToast } from "@chakra-ui/react";
import { getReferral, requestDateExtension,requestNewCode,requestPayout } from "../../slices/referral";



function Referrals() {
  const toast = useToast();
   const dispatch = useDispatch();
   const [refferer, setRefferer] = useState({});

   useEffect(() => {
     const id = JSON.parse(localStorage.getItem("user-coindraw"))?.id;
     dispatch(getReferral(id))
       .unwrap()
       .then((res) => {
         console.log(res);
         setRefferer(res);
       });
   }, []);



   const stats = [
     {
       name: "Current Code",
       stat: refferer?.referralCode,
       button: "Request New Code",
     },
     {
       name: "Expiry Date",
       stat: new Date(refferer?.referralExpiryDate).toLocaleDateString(),
       button: "Request Date Extention",
     },
     {
       name: "Pending Payout",
       stat: refferer?.referrerCount,
       button: "Request Payout"
     },
   ];

   const handleRequestPayout = async () => {
     try {
      dispatch(requestPayout(refferer));
       toast({
         title: "Success",
         description: "Payout request successful",
         status: "success",
         duration: 5000,
         isClosable: true,
       });
            location.reload();
     } catch (error) {
       toast({
         title: "Error",
         description: "Payout request failed",
         status: "error",
         duration: 5000,
         isClosable: true,
       });
     }
   }
   const handleRequestNewCode = async () => {
     try {
      dispatch(requestNewCode(refferer));
       toast({
         title: "Success",
         description: "New code request successful",
         status: "success",
         duration: 5000,
         isClosable: true,
       });
       location.reload();
     } catch (error) {
       toast({
         title: "Error",
         description: "New code request failed",
         status: "error",
         duration: 5000,
         isClosable: true,
       });
     }
   }
   const handleRequestDateExtension = async () => {
     try {
      dispatch(requestDateExtension(refferer));
       toast({
         title: "Success",
         description: "Date extension request successful",
         status: "success",
         duration: 5000,
         isClosable: true,
       });
            location.reload();
     } catch (error) {
       toast({
         title: "Error",
         description: "Date extension request failed",
         status: "error",
         duration: 5000,
         isClosable: true,
       });
     }
   }

  return (
    <div>
      <Head>
        <title>Coindraw Admin | Referrals</title>
        <meta
          name="description"
          content="Coindraw Administration | Referrals"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title={"Requests"}>
        {/* Buttons */}
        <div className="p-8 ">

          <dl className="grid grid-cols-1 gap-5 mt-5 sm:grid-cols-3">
            {stats.map((item, index) => (
              <div
                key={item.name}
                className="px-4 py-5 overflow-hidden bg-white border rounded-lg shadow sm:p-6"
              >
                <dt className="text-lg font-medium uppercase truncate text-green">
                  {item.name}
                </dt>
                <dd className="mt-1 mb-4 text-3xl font-semibold tracking-tight text-gray-900">
                  {item.stat}
                </dd>
                {index === 0 && (
                  <button onClick={
                    handleRequestPayout
                  } className="p-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {item.button}
                  </button>
                )}
                {index === 1 && (
                  <button onClick={
                    handleRequestDateExtension
                   }  className="p-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {item.button}
                  </button>
                )}
                {index === 2 && (
                  <button onClick={
                    handleRequestNewCode
                  } className="p-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {item.button}
                  </button>
                )}
              </div>
            ))}
          </dl>
          <div className="mt-5">
            {refferer?.requestPayout?.requested && (
              <div className="p-4 mb-4 bg-yellow-200 rounded-md">
                <p className="text-lg font-semibold text-yellow-700">Payout Requested on {new Date(refferer?.requestPayout.requestedDate).toLocaleDateString()}</p>
              </div>
            )}
            {refferer?.requestNewCode?.requested && (
              <div className="p-4 mb-4 bg-blue-200 rounded-md">
                <p className="text-lg font-semibold text-blue-700">New Code Requested on {new Date(refferer?.requestNewCode.requestedDate).toLocaleDateString()}</p>
              </div>
            )}
            {refferer?.requestDateExtension?.requested && (
              <div className="p-4 mb-4 rounded-md bg-green">
                <p className="text-lg font-semibold text-white">Date Extension Requested on {new Date(refferer?.requestDateExtension.requestedDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Referrals;
