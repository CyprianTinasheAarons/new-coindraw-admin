import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Head from "next/head";
import Layout from "../../components/ui/Layout";
import {
  getReferral,
  requestDateExtension,
  requestNewCode,
  requestPayout,
  getMaticPrice,
} from "../../slices/referral";


import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  useDisclosure
} from "@chakra-ui/react";

function Referrals() {
  const toast = useToast();
  const dispatch = useDispatch();
  const [refferer, setRefferer] = useState({});
  const [prices, setPrices] = useState({});
  const [requestedCode, setRequestedCode] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2} = useDisclosure();

   useEffect(() => {
     const id = JSON.parse(localStorage.getItem("user-coindraw"))?.id;
     dispatch(getReferral(id))
       .unwrap()
       .then((res) => {
         console.log(res);
         setRefferer(res);
       });
   }, []);


     const currencySymbols = {
       gbp: "£",
       usd: "$",
       eur: "€",
     };



   const stats = [
     {
       name: "Current Code",
       stat: refferer?.referralCode,
       button: "Request New Code",
     },
     {
       name: "Expiry Date",
       stat: new Date(refferer?.referralExpiryDate).toLocaleDateString("en-GB"),
       button: "Request Date Extention",
     },
     {
       name: "Pending Payout",
       stat: refferer?.referrerReward?.toFixed(2) + " POL/ " + currencySymbols[refferer?.payout?.currency] + "" + (refferer?.referrerReward * prices?.[refferer?.payout?.currency])?.toFixed(2),
       button: "Request Payout",
     },
   ];

   const handleRequestPayout = async () => {
     try {
      await dispatch(requestPayout(refferer)).unwrap();
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
      const data = {
        userId: refferer?.userId,
        code: requestedCode
      }
     
     try {
      await dispatch(requestNewCode(data)).unwrap();
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
      await dispatch(requestDateExtension(refferer)).unwrap();
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

   
     useEffect(() => {

         dispatch(getMaticPrice())
           .unwrap()
           .then((res) => {
             console.log(res);
             setPrices(res);
           });
       
     }, []);


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
                  <>
                    <button
                      onClick={onOpen2}
                      className="p-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {item.button}
                    </button>
                    <Modal isOpen={isOpen2} onClose={onClose2}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Request New Code</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <div className="flex flex-col">
                            <label htmlFor="newCode" className="mb-2 text-sm font-medium text-gray-700">New Code (leave blank for random code):</label>
                            <input type="text" id="code" name="code"  value={requestedCode} className="p-2 border border-gray-300 rounded-md" onChange={
                              (e) => setRequestedCode(e.target.value)
                            } />
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <button className="p-1 mr-3 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={handleRequestNewCode}>Confirm</button>
                          <button className="p-1 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={onClose2}>Cancel</button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </>
                )}
                {index === 1 && (
                  <button
                    onClick={handleRequestDateExtension}
                    className="p-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {item.button}
                  </button>
                )}
                {index === 2 && (
                  <>
                    <button
                      onClick={onOpen}
                      className="p-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {item.button}
                    </button>
                    <Modal isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Request Payout</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          This payment will be made to the preferred payment method set in your <a href="/referrals/profile" className="font-semibold underline">My Profile</a> section.
                        </ModalBody>
                        <ModalFooter>
                          <button className="p-1 mr-3 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={handleRequestPayout}>Confirm</button>
                          <button className="p-1 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={onClose}>Cancel</button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </>
                )}
              </div>
            ))}
          </dl>
          <div className="mt-5">
            {refferer?.requestPayout?.requested && (
              <div className="p-4 mb-4 bg-yellow-200 rounded-md">
                <p className="text-lg font-semibold text-yellow-700">
                  Payout Requested on{" "}
                  {new Date(
                    refferer?.requestPayout.requestedDate
                  ).toLocaleDateString()}
                </p>
              </div>
            )}
            {refferer?.requestNewCode?.requested && (
              <div className="p-4 mb-4 bg-blue-200 rounded-md">
                <p className="text-lg font-semibold text-blue-700">
                  New Code Requested on{" "}
                  {new Date(
                    refferer?.requestNewCode.requestedDate
                  ).toLocaleDateString()}
                </p>
              </div>
            )}
            {refferer?.requestDateExtension?.requested && (
              <div className="p-4 mb-4 rounded-md bg-green">
                <p className="text-lg font-semibold text-white">
                  Date Extension Requested on{" "}
                  {new Date(
                    refferer?.requestDateExtension.requestedDate
                  ).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Referrals;
