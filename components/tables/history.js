import { useEffect, useState } from "react";
import CsvDownloader from "react-csv-downloader";
import { useSelector, useDispatch } from "react-redux";
import { Spinner, Tooltip, useToast } from "@chakra-ui/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import transactionService from "../../api/transaction.service";
import { create as ipfsHttpClient } from "ipfs-http-client";
import ReactPaginate from "react-paginate";
import { debounce } from "lodash"; // Assuming lodash is available
import { getTransactions } from "../../slices/transactions";
// Get project credentials from environment variables
const projectId = process.env.NEXT_PUBLIC_IPFS_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_API_KEY_SECRET;
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString(
  "base64"
)}`;

// Initialize the IPFS client
const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.NEXT_PUBLIC_PRIVATE_KEY,
  "polygon"
);

export default function HistoryTable() {
  const dispatch = useDispatch();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [reminting, setReminting] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const isLoading = useSelector((state) => state.transactions.isLoading);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const IPFS_SUBDOMAIN = "https://coindraw.infura-ipfs.io";
  const [totalPages, setTotalPages] = useState(0); // Math.ceil(filteredData.length / rowsPerPage)

  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  const [transactions, setTransactions] = useState([]);

  const getData = async (currentPage, rowsPerPage) => {
    try {
      const response = await dispatch(
        getTransactions(currentPage, 50)
      ).unwrap();

      // Replace transactions instead of appending
      setTransactions(response);
      setTotalPages(Math.ceil(response.total / rowsPerPage));
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      // Handle error (e.g., show a notification or set an error state)
    }
  };

  const handlePageChange = (data) => {
    setPage(data.selected + 1);
    getData(data.selected + 1, rowsPerPage);
  };

  // Effect for fetching data
  useEffect(() => {
    getData(page, rowsPerPage); // Fetch transactions immediately on component mount
    const interval = setInterval(getData, 300000); // Fetches transactions every 5 minutes
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  // Debounced effect for filtering
  const debouncedSearch = debounce(() => {
    setFilteredTransactions(
      transactions.filter(
        (t) =>
          t?.walletAddress?.toLowerCase().includes(search.toLowerCase()) ||
          t?.contractAddress?.toLowerCase().includes(search.toLowerCase()) ||
          t?.transactionHash?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, 500); // 500 ms debounce time

  useEffect(() => {
    debouncedSearch();
    // Cancel the debounce on cleanup to prevent it from running after the component unmounts
    return () => debouncedSearch.cancel();
  }, [search, transactions]);

  const remint = async (txn) => {
    setReminting(true);
    setSelectedId(txn.id);

    toast({
      title: "Reminting",
      description: "Your NFTs are being reminted.",
      status: "info",
      duration: 9000,
      isClosable: true,
    });

    const nftCollection = await sdk.getContract(txn.contractAddress, txn.abi);
    const supply = await nftCollection.call("totalSupply");
    let URLs = [];

    let tokenId = parseInt(supply) + 1;

    const metadataPromises = Array.from(
      { length: txn.quantity },
      async (_, i) => {
        const metadata = {
          description: "The Luck of the Draw",
          animation_url: `ipfs://QmRJjfhyDH6cvjJFxbaKBokpY6cJFE77DSiK4umxfK1cQH/${
            tokenId + i
          }.gif`,
          image: `ipfs://QmRJjfhyDH6cvjJFxbaKBokpY6cJFE77DSiK4umxfK1cQH/${
            tokenId + i
          }.gif`,
          name: "Will it be you?",
          attributes: [
            {
              trait_type: "Answer",
              value: txn.answer,
            },
          ],
          compiler: "Coindraw Draw Engine",
        };
        const metadataString = JSON.stringify(metadata, null, 2);
        const metadataBuffer = new Buffer.from(metadataString);
        const added = await client.add({ content: metadataBuffer });
        return `${IPFS_SUBDOMAIN}/ipfs/${added.path}`;
      }
    );

    URLs = await Promise.all(metadataPromises);

    const {
      id,
      walletAddress,
      contractAddress,
      PaypalPaymentId,
      PaypalPaymentStatus,
      PaypalPaymentAmount,
      PaypalPaymentCurrency,
      email,
      quantity,
      draw,
      answer,
    } = txn;

    const handleToast = (title, description, status) => {
      toast({
        title,
        description,
        status,
        duration: 9000,
        isClosable: true,
      });
    };

    try {
      const response = await nftCollection.call(
        "mintForAddressDynamic",
        [quantity, tokenId, walletAddress, URLs],
        { gasPrice: 500000000000 }
      );

      setReminting(false);
      handleToast(
        "Minting successful",
        "Your NFTs have been minted",
        "success"
      );

      await transactionService.update(id, {
        transactionHash: response?.receipt?.transactionHash,
        contractAddress: contractAddress,
        success: true,
        walletAddress: walletAddress,
        PaypalPaymentId: PaypalPaymentId,
        PaypalPaymentStatus: PaypalPaymentStatus,
        PaypalPaymentAmount: PaypalPaymentAmount,
        PaypalPaymentCurrency: PaypalPaymentCurrency,
        email: email,
        quantity: quantity,
        abi: draw?.abi,
        answer: answer,
      });
      location.reload();
    } catch (error) {
      console.error(error);
      setReminting(false);
      handleToast("Minting failed", "Your NFTs could not be minted", "error");
    }
  };

  return (
    <>
      <div className="my-2 ">
        <CsvDownloader
          datas={filteredTransactions}
          filename="history"
          extension=".csv"
          separator=";"
          wrapColumnChar="'"
        >
          <button className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Download Report{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 px-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </button>
        </CsvDownloader>
      </div>
      <div>
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700"
        >
          Quick search
        </label>
        <div className="relative flex items-center mt-1">
          <input
            type="text"
            name="search"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pr-12 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <kbd className="inline-flex items-center px-2 font-sans text-sm font-medium text-gray-400 border border-gray-200 rounded">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Transactions
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              This is a list of all transactions that have been made to the
              giveaway address.
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
                        Contract Address
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        User Address
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Transaction Hash
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Email
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
                        Paypal Details
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Payment Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {filteredTransactions?.map((tnx) => (
                      <tr key={tnx?.id}>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <Tooltip label={tnx.contractAddress}>
                            <a
                              href={`https://polygonscan.com/address/${tnx?.contractAddress}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold underline text-green"
                            >
                              {truncate(tnx?.contractAddress, 12)}
                            </a>
                          </Tooltip>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <Tooltip label={tnx?.walletAddress}>
                            <a
                              href={`https://polygonscan.com/address/${tnx?.walletAddress}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold underline text-green"
                            >
                              {truncate(tnx?.walletAddress, 12)}
                            </a>
                          </Tooltip>
                        </td>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                          {tnx?.transactionHash ? (
                            <a
                              href={`https://polygonscan.com/tx/${tnx?.transactionHash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold underline text-green"
                            >
                              {truncate(tnx?.transactionHash, 16)}
                            </a>
                          ) : (
                            <a
                              href={`https://polygonscan.com/tx/${tnx?.transactionHash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-red-500"
                            >
                              Transaction Failed
                            </a>
                          )}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {tnx?.email}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <Tooltip label={new Date(tnx?.createdAt).toLocaleTimeString('en-GB')}>
                            {new Date(tnx?.createdAt).toLocaleDateString()}
                          </Tooltip>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {tnx?.PaypalPayment ? (
                            <a
                              href={`https://www.paypal.com/activity/payment/${tnx?.PaypalPaymentId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold underline text-green"
                            >
                              View
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {tnx?.PaypalPayment ? (
                            <p>{tnx?.success ? "Success" : "Failed"}</p>
                          ) : (
                            <p>{tnx?.success ? "Success" : "Failed"}</p>
                          )}
                        </td>
                        <td>
                          {!tnx.success && tnx?.PaypalPayment ? (
                            <>
                              <button
                                onClick={() => remint(tnx)}
                                className="p-1 px-2 text-white bg-blue-500 rounded-md"
                              >
                                {reminting && tnx.id == selectedId
                                  ? "Reminting..."
                                  : `Remint (${tnx?.quantity})`}
                              </button>
                            </>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="">
                <div className="flex justify-center">
                  <ReactPaginate
                    nextLabel="next >"
                    onPageChange={(data) => handlePageChange(data)}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={totalPages}
                    previousLabel="< previous"
                    pageClassName="flex items-center justify-center border border-gray-300 rounded mx-1"
                    pageLinkClassName="px-3 py-2 text-sm text-gray-500 hover:bg-gray-200"
                    previousClassName="flex items-center justify-center border border-gray-300 rounded mx-1"
                    previousLinkClassName="px-3 py-2 text-sm text-gray-500 hover:bg-gray-200"
                    nextClassName="flex items-center justify-center border border-gray-300 rounded mx-1"
                    nextLinkClassName="px-3 py-2 text-sm text-gray-500 hover:bg-gray-200"
                    breakLabel="..."
                    breakClassName="flex items-center justify-center border border-gray-300 rounded mx-1"
                    breakLinkClassName="px-3 py-2 text-sm text-gray-500 hover:bg-gray-200"
                    containerClassName="flex items-center justify-center space-x-2"
                    activeClassName="bg-gray-200"
                    renderOnZeroPageCount={null}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
