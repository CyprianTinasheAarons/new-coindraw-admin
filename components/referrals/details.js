import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";

import { CopyToClipboard } from "react-copy-to-clipboard";
import userService from "../../api/user.service";

const Details = ({ data }) => {
  const [copiedList, setCopiedList] = useState([]);
  const [selected, setSelected] = useState({});
  const [selectedDetails, setSelectedDetails] = useState({});
  const [usernames, setUsernames] = useState({});
  
  const toast = useToast();

  const setCopied = (id) => {
    setCopiedList([...copiedList, id]);
  };

  useEffect(() => {
    const selectedUsers = Object.keys(selected).filter((key) => selected[key]);
    const selectedWallets = selectedUsers.map((user) => {
      const selectedUser = data.find((item) => item.id === user);
      return selectedUser.referrerWalletAddress;
    });

    const selectedAmounts = selectedUsers.map((user) => {
      const selectedUser = data.find((item) => item.id === user);
      return selectedUser.referrerReward;
    });

    setSelectedDetails({
      selectedWallets,
      selectedAmounts,
    });
  }, [selected]);


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
    <>
      <div className="w-full">
        <button
          onClick={() => {
            const newSelected = {};
            data.forEach((item) => {
              newSelected[item.id] = true;
            });
            setSelected(newSelected);
          }}
          className="px-4 py-2 mr-2 text-white bg-gray-800 rounded-md"
        >
          Select All
        </button>
        <button
          onClick={() => {
            const newSelected = {};
            data.forEach((item) => {
              newSelected[item.id] = false;
            });
            setSelected(newSelected);
          }}
          className="px-4 py-2 text-white bg-gray-800 rounded-md"
        >
          Deselect All
        </button>
        {Object.values(selected).filter(Boolean).length > 1 && (
          <CopyToClipboard
            text={JSON.stringify(selectedDetails)}
            onCopy={() => {
              toast({
                title: "Selected copied.",
                status: "success",
                duration: 9000,
                isClosable: true,
              });
            }}
          >
            <button className="px-4 py-2 ml-2 text-white bg-gray-800 rounded-md">
              Copy Selected
            </button>
          </CopyToClipboard>
        )}
      </div>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
            >
              Select
            </th>

            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
            >
              referrer Username
            </th>

            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
            >
              referrer Address
            </th>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
            >
              Reward Amount
            </th>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {data?.map((r) => (
            <tr
              key={r.id}
              className={copiedList.includes(r?.id) ? "bg-blue-50" : ""}
            >
              <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                <input
                  type="checkbox"
                  checked={selected[r?.id]}
                  onChange={(e) => {
                    setSelected({
                      ...selected,
                      [r?.id]: e.target.checked,
                    });
                  }}
                />
              </td>
              <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                {usernames[r?.userId]}
              </td>

              <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                {r?.referrerWalletAddress}
              </td>
              <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                {r?.referrerReward}
              </td>
              <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                <CopyToClipboard
                  text={JSON.stringify({
                    address: r?.referrerWalletAddress,
                    amount: r?.referrerReward,
                  })}
                  onCopy={() => [
                    setCopied(r?.id),
                    toast({
                      title: "Copied",
                      description: "Copied to clipboard",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    }),
                  ]}
                >
                  {copiedList.includes(r?.id) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      className="w-6 h-6 text-green"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                      />
                    </svg>
                  ) : (
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
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                      />
                    </svg>
                  )}
                </CopyToClipboard>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Details;
