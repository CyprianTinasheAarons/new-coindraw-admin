import { Spinner, Tooltip } from "@chakra-ui/react";
import { useSelector } from "react-redux";
export default function DistributionTable({ data }) {
  const isLoading = useSelector((state) => state.distribution.isLoading);

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  return (
    <div className="mt-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Transactions
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            This is a list of all transactions that have been made to the
            distribution address.
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
                      Transaction Hash
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      From
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      To
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {data?.map((tnx) => (
                    <tr key={tnx.hash}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                        <a
                          href={`https://polygonscan.com/tx/${tnx.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold underline text-green"
                        >
                          {truncate(tnx.txHash, 16)}
                        </a>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <Tooltip label={tnx.from}>
                          {truncate(tnx.from, 12)}
                        </Tooltip>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <Tooltip label={tnx.to}>{truncate(tnx.to, 12)}</Tooltip>
                      </td>

                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(tnx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {tnx.note}
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
