import { Spinner, useToast } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { deleteReferral } from "../../slices/referral";
import { CopyToClipboard } from "react-copy-to-clipboard";
import userService from "../../api/user.service";
import React, { useState, useEffect } from "react";
import ReferralApprovals from "../../components/tables/referralApprovals";
import ReferralTransactions from "../../components/tables/referralTransactions";
import ReferralRequests from "../../components/tables/referralRequests";

export default function ReferralTable({ data }) {
  const isLoading = useSelector((state) => state.referral.isLoading);
  const [usernames, setUsernames] = useState({});
  const [tab, setTab] = useState("referrals");
  const toast = useToast();

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  const dispatch = useDispatch();

  const handleDelete = async (id) => {
    await dispatch(deleteReferral(id))
      .unwrap()
      .then(() => {
        toast({
          title: "Referral deleted.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        location.reload();
      });
  };

  const calculateDaysLeft = (expiryDate) => {
    const currentDate = new Date();
    const expirationDate = new Date(expiryDate);
    const diffTime = Math.abs(expirationDate - currentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  useEffect(() => {
    const fetchUsernames = async () => {
      const newNames = {};
      for (const r of data) {
        const username = await fetchUser(r?.userId);
        newNames[r?.userId] = username;
      }
      setUsernames(newNames);
    };

    fetchUsernames();
  }, [data]);

  const fetchUser = async (id) => {
    let username = null;
    await userService.get(id).then((res) => {
      username = res.data.username;
    });
    return username;
  };

  return (
    <div className="mt-4">
      {tab === "referrals" && (
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Referrals
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              This is a list of all referrals created by the administrator.
            </p>
          </div>
        </div>
      )}
      {tab === "transactions" && (
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Transactions
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              This is a list of all transactions related to referrals.
            </p>
          </div>
        </div>
      )}
      {tab === "approvals" && (
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Approvals
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              This is a list of all approvals related to referrals.
            </p>
          </div>
        </div>
      )}
      {tab === "requests" && (
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Requests
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              This is a list of all requests related to referrals.
            </p>
          </div>
        </div>
      )}
      <div>
        <div className="flex justify-end">
          <button
            onClick={() => setTab("referrals")}
            className={`p-2 border-2 border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              tab == "referrals" ? "ring-indigo-500" : ""
            }`}
          >
            View Referrals
          </button>
          <button
            onClick={() => setTab("transactions")}
            className={`p-2 mx-2 border-2 border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              tab == "transactions" ? "ring-indigo-500 " : ""
            }`}
          >
            View Transactions
          </button>
          <button
            onClick={() => setTab("approvals")}
            className={`p-2 border-2 border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              tab == "approvals" ? "ring-indigo-500" : ""
            }`}
          >
            View Approvals
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {data.filter((approval) => !approval.approved).length}
            </span>
          </button>
          <button
            onClick={() => setTab("requests")}
            className={`p-2 border-2 border-gray-300 rounded-md ml-2 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              tab == "requests" ? "ring-indigo-500" : ""
            }`}
          >
            View Requests
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {data.filter((t) => t?.requestPayout?.requested === true || t?.requestNewCode?.requested === true || t?.requestDateExtension?.requested === true).length}
            </span>
          </button>
        </div>
      </div>
      <div className="flow-root mt-8">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : (
              <>
                {tab == "referrals" && (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                        >
                          Refferer Username
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Referral Code
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Referral Link
                        </th>

                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Days Left
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Count
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Rewards
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Total
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {data
                        ?.filter((r) => r?.approved === true)
                        .map((r) => (
                          <tr key={r?.id}>
                            <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                              {usernames[r?.userId]}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {r?.referralCode}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                              <CopyToClipboard
                                text={r?.referralLink}
                                onCopy={() =>
                                  toast({
                                    title: "Link copied.",
                                    status: "success",
                                    duration: 9000,
                                    isClosable: true,
                                  })
                                }
                              >
                                <button className="inline-flex items-center py-2 text-sm font-semibold text-gray-900 underline bg-white rounded-md shadow-sm hover:bg-gray-50">
                                  {truncate(r?.referralLink, 20)}
                                </button>
                              </CopyToClipboard>
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {calculateDaysLeft(r?.referralExpiryDate)}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {r?.referrerCount}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {r?.referrerReward}
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                              {r?.referrerTotalReward}
                            </td>
                            <td className="flex px-3 py-4 text-sm text-gray-500 align-middle whitespace-nowrap">
                              <CopyToClipboard
                                text={r?.referralLink}
                                onCopy={() =>
                                  toast({
                                    title: "Link copied.",
                                    status: "success",
                                    duration: 9000,
                                    isClosable: true,
                                  })
                                }
                              >
                                <button className="inline-flex items-center px-3 py-2 mx-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                  Copy Link
                                </button>
                              </CopyToClipboard>
                              <button
                                type="button"
                                onClick={() => handleDelete(r?.id)}
                                className="inline-flex items-center px-3 py-2 mx-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
                {tab == "transactions" && <ReferralTransactions data={data} />}
                {tab == "approvals" && (
                  <ReferralApprovals
                    approvals={data.filter((approval) => !approval.approved)}
                  />
                )}
                {tab == "requests" && <ReferralRequests data={data} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
