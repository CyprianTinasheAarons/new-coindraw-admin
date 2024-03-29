import Layout from "../components/Layout";
import { distributeAddress } from "../common/addresses";
import ReferralTable from "../components/tables/referralTable";
import Users from "../components/referrals/users";
import Details from "../components/referrals/details";
import Distribute from "../components/referrals/distribute";
import DistributeAll from "../components/referrals/distributeAll";
import SetPercentage from "../components/referrals/setPercentage";
import CustomModal from "../components/CustomModal";
import { useDisclosure, useToast } from "@chakra-ui/react";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  createReferral,
  getReferrals,
  getMaticPrice,
} from "../slices/referral";

const ReferralsComponent = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const contractAddress = distributeAddress;
  const {
    isOpen: isReffererModalOpen,
    onOpen: onOpenReffererModal,
    onClose: onCloseReffererModal,
  } = useDisclosure();

  const {
    isOpen: isOpenDistribute,
    onOpen: onOpenDistribute,
    onClose: onCloseDistribute,
  } = useDisclosure();

  const {
    isOpen: isOpenDistributeAll,
    onOpen: onOpenDistributeAll,
    onClose: onCloseDistributeAll,
  } = useDisclosure();

  const {
    isOpen: isOpenDetails,
    onOpen: onOpenDetails,
    onClose: onCloseDetails,
  } = useDisclosure();

  const {
    isOpen: isOpenSetPercentage,
    onOpen: onOpenSetPercentage,
    onClose: onCloseSetPercentage,
  } = useDisclosure();

  const [referrals, setReferrals] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);

  const getData = async () => {
    await dispatch(getReferrals())
      .unwrap()
      .then((res) => {
        setReferrals(res);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const [refferer, setRefferer] = useState({
    userId: "",
    walletAddress: "",
  });

  const handleSelected = async (user, referralExpiryDate) => {
    console.log(user, referralExpiryDate);
    if (user) {
      setRefferer({
        userId: user.id,
        walletAddress: user.walletAddress,
        referralExpiryDate: referralExpiryDate,
      });
      setSelectedUser(user);
    }
  };

  const create = async () => {
    await dispatch(createReferral(refferer))
      .unwrap()
      .then(() => {
        toast({
          title: "Referral Created",
          description: "Referral created successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        getData();
        onCloseReffererModal();
        location.reload();
      })
      .catch((err) => {
        toast({
          title: "Referral Creation Failed",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    dispatch(getMaticPrice())
      .unwrap()
      .then((res) => {
        console.log(res?.["matic-network"]);
      });
  }, []);

  return (
    <Layout>
      <div className="py-8 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Distribution Address:{" "}
          <a href="#" className="font-semibold underline text-green">
            {contractAddress}
          </a>
        </h3>
        <div className="flex mt-3 sm:ml-4 sm:mt-0">
          <button
            type="button"
            onClick={onOpenDistribute}
            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Distribute
          </button>
          <button
            type="button"
            onClick={onOpenDistributeAll}
            className="inline-flex items-center px-3 py-2 mx-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Distribute(All)
          </button>
          <button
            type="button"
            onClick={onOpenDetails}
            className="inline-flex items-center px-3 py-2 mx-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Get Addresses
          </button>
          <button
            type="button"
            onClick={onOpenSetPercentage}
            className="inline-flex items-center px-3 py-2 mr-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Set Percentage
          </button>
          <button
            type="button"
            onClick={onOpenReffererModal}
            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Add Refferer
          </button>
        </div>
      </div>
      <div>
        <p className="py-1 italic font-bold text-indigo-500">
          {referrals?.length > 0 &&
            `Current Rewards percentage is : ${referrals[0]?.referralPercentage}%`}
        </p>
      </div>
      {referrals && <ReferralTable data={referrals} />}

      <CustomModal
        isOpen={isOpenDistribute}
        onClose={onCloseDistribute}
        title="Distribute"
      >
        <Distribute />
      </CustomModal>

      <CustomModal
        isOpen={isOpenDistributeAll}
        onClose={onCloseDistributeAll}
        title="Distribute All"
      >
        <DistributeAll />
      </CustomModal>

      <CustomModal
        isOpen={isOpenDetails}
        onClose={onCloseDetails}
        title="Details"
      >
        <Details data={referrals} />
      </CustomModal>

      <CustomModal
        isOpen={isOpenSetPercentage}
        onClose={onCloseSetPercentage}
        title="Set Percentages"
      >
        <SetPercentage />
      </CustomModal>

      <CustomModal
        isOpen={isReffererModalOpen}
        onClose={onCloseReffererModal}
        title="Add New Refferer"
      >
        <div className="flex flex-col">
          <Users onData={handleSelected} />
          <div className="my-6">
            <button
              type="button"
              onClick={create}
              className="absolute bottom-0 right-0 inline-flex items-center px-3 py-2 m-2 mx-4 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Create
            </button>
          </div>
        </div>
      </CustomModal>
    </Layout>
  );
};

export default ReferralsComponent;
