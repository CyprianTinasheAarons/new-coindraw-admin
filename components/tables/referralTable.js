import { Spinner, Tooltip, useToast } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { deleteReferral } from "../../slices/referral";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function ReferralTable({ data }) {
  const isLoading = useSelector((state) => state.referral.isLoading);

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

  return (
    <div className="mt-4">
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
      <div className="flow-root mt-8">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      Refferer
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
                      Referral Count
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Refferer Reward
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Total Rewards
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
                  {data?.map((r) => (
                    <tr key={r.id}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                        <Tooltip label={r?.reffererWalletAddress}>
                          {truncate(r?.reffererWalletAddress, 12)}
                        </Tooltip>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {r?.referralCode}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {" "}
                        <Tooltip label={r?.referralLink}>
                          {truncate(r?.referralLink, 20)}
                        </Tooltip>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {r?.reffererCount}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {r?.reffererReward}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {r?.reffererTotalReward}
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
          </div>
        </div>
      </div>
    </div>
  );
}
