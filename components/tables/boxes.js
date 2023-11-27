import { useEffect, useState } from "react";
import boxService from "../../api/box.service";
import userService from "../../api/user.service";
import CsvDownloader from "react-csv-downloader";
import {useToast} from "@chakra-ui/react";
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BoxesTable(data) {
  const [boxes, setBoxes] = useState([]);
  const [usersDetails, setUserDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [prizeFilter, setPrizeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchBoxes = async () => {
    const response = await boxService.getAll();
    setBoxes(response?.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
  };
  
  useEffect(() => {
    fetchBoxes();
  }, []);


  useEffect(() => {
    const fetchUserDetails = async () => {
      const userDetails = await Promise.all(
        boxes.map(async (box) => {
          const response = await userService.get(box.owner);
          return {
            username: response?.data?.username,
            walletAddress: response?.data?.walletAddress
          };
        })
      );
      setUserDetails(userDetails);
    };
    fetchUserDetails();
  }, [boxes]);


  useEffect(() => {
    let filtered = boxes;
    if (search) {
      filtered = filtered.filter(
        (b) =>
          b?.boxType?.toLowerCase().includes(search.toLowerCase()) ||
          b?.owner?.toLowerCase().includes(search.toLowerCase()) ||
          usersDetails.some(
            (u) =>
              u?.username?.toLowerCase().includes(search.toLowerCase()) ||
              u?.walletAddress?.toLowerCase().includes(search.toLowerCase())
          )
      );
    }
    if (prizeFilter) {
      filtered = filtered.filter(
        (b) =>
          b?.prize?.name?.toLowerCase().includes(prizeFilter.toLowerCase()) ||
          b?.prize?.type?.toLowerCase().includes(prizeFilter.toLowerCase())
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(
        (b) =>
          b?.status?.toString() === statusFilter
      );
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(
        (b) =>
          new Date(b.createdAt) >= new Date(dateRange.start) &&
          new Date(b.createdAt) <= new Date(dateRange.end)
      );
    }
   
    setFilteredData(filtered);
  }, [search, boxes, usersDetails, dateRange, prizeFilter, statusFilter]);

  const toast = useToast();

  const handleFulfillmentChange = async (id) => {
    try {
      const response = await boxService.update(id, {fulfilled: true});
      if (response?.status === 200) {
        fetchBoxes();
        toast({
          title: "Box updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }




  return (
    <>
      <div className="my-2 ">
        <CsvDownloader
          datas={boxes}
          filename="boxes"
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="search"
            className="block w-full pr-12 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <kbd className="inline-flex items-center px-2 font-sans text-sm font-medium text-gray-400 border border-gray-200 rounded">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>
      <div className="w-1/3 mt-4">
        <label
          htmlFor="dateRange"
          className="block text-sm font-medium text-gray-700"
        >
          Date Range
        </label>
        <div className="relative flex items-center mt-1">
          <DatePicker
            selected={dateRange.start}
            onChange={(date) => setDateRange({ ...dateRange, start: date })}
            selectsStart
            startDate={dateRange.start}
            endDate={dateRange.end}
            dateFormat="dd/MM/yyyy"
            className="block w-full pr-12 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <DatePicker
            selected={dateRange.end}
            onChange={(date) => setDateRange({ ...dateRange, end: date })}
            selectsEnd
            startDate={dateRange.start}
            endDate={dateRange.end}
            minDate={dateRange.start}
            dateFormat="dd/MM/yyyy"
            className="block w-full pr-12 ml-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="w-1/3 mt-4">
        <label
          htmlFor="stateFilter"
          className="block text-sm font-medium text-gray-700"
        >
          Filter by status
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-full p-1 pr-12 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All</option>
          <option value="true">Opened</option>
          <option value="false">Closed</option>
        </select>
      </div>
      <div className="w-1/3 mt-4">
        <label
          htmlFor="prizeFilter"
          className="block text-sm font-medium text-gray-700"
        >
          Filter by prize name or type
        </label>
        <input
          type="text"
          name="prizeFilter"
          value={prizeFilter}
          onChange={(e) => setPrizeFilter(e.target.value)}
          id="prizeFilter"
          className="block w-full pr-12 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      
      <div className="my-2 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Boxes
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            This is a comprehensive list of all boxes in the system.
          </p>
        </div>
      </div>
      <div className="px-6 lg:px-8">
        <div className="sm:flex sm:items-center"></div>
        <div className="flow-root mt-8">
          <div className="-mx-6 -my-2 overflow-x-auto lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle ">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      Box Type
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Owner
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Prize
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Won
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Fulfilled
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredData
                    .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                    .map((box, index) => (
                      <tr key={box?.id}>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                          {box?.boxType}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className="truncate">
                              {usersDetails[index]?.username} -{" "}
                              {usersDetails[index]?.walletAddress}
                            </div>
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  `${usersDetails[index]?.username} - ${usersDetails[index]?.walletAddress}`
                                )
                              }
                              className="text-blue-600 hover:text-blue-800 active:text-blue-900 focus:outline-none"
                            >
                              Copy
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {box?.status ? "Opened" : "Unopened"}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <div className="prize-details">
                            <div className="prize-name">
                              {box?.prize?.type}-{box?.prize?.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {box?.won ? "Yes" : "No"}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Intl.DateTimeFormat("en-GB").format(
                            new Date(box?.createdAt)
                          )}
                        </td>
                        <td className="px-3 py-4 text-sm font-medium text-right whitespace-nowrap">
                          {box?.prize?.type === "Physical" && (
                            <input
                              type="checkbox"
                              checked={box?.fulfilled}
                              onChange={() => handleFulfillmentChange(box?.id)}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="flex justify-center">
                <ReactPaginate
                  pageCount={Math.ceil(filteredData.length / rowsPerPage)}
                  pageRangeDisplayed={5}
                  marginPagesDisplayed={2}
                  onPageChange={(data) => setPage(data.selected + 1)}
                  containerClassName={"pagination"}
                  activeClassName={" text-white bg-indigo-600"}
                  breakClassName={"break-me"}
                  breakLinkClassName={"px-3 py-1 rounded-md border border-gray-300"}
                  pageClassName={"relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"}
                  pageLinkClassName={"relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"}
                  previousClassName={"relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"}
                  previousLinkClassName={"relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"}
                  nextClassName={"relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"}
                  nextLinkClassName={"relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"}
                  disabledClassName={"opacity-50 cursor-not-allowed"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
