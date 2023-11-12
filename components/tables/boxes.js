import { useEffect, useState } from "react";
import boxService from "../../api/box.service";
import userService from "../../api/user.service";
import CsvDownloader from "react-csv-downloader";

export default function BoxesTable(data) {
  const [boxes, setBoxes] = useState([]);
  const [usersDetails, setUserDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  
  const fetchBoxes = async () => {
    const response = await boxService.getAll();
    setBoxes(response?.data);
  };
  
  useEffect(() => {
    fetchBoxes();
  }, []);

  useEffect(() => {
    setFilteredData(
      boxes.filter(
        (b) =>
          b?.boxType?.toLowerCase().includes(search.toLowerCase()) ||
          b?.owner?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, boxes]);


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
           
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredData.map((box,index) => (
                    <tr key={box?.id}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                        {box?.boxType}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="truncate">
                            {usersDetails[index]?.username} - {usersDetails[index]?.walletAddress}
                          </div>
                          <button
                            onClick={() => navigator.clipboard.writeText(`${usersDetails[index]?.username} - ${usersDetails[index]?.walletAddress}`)}
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
                          <div className="prize-name">{box?.prize?.type}-{box?.prize?.name}</div>
                
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {box?.won ? "Yes" : "No"}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Intl.DateTimeFormat('en-GB').format(new Date(box?.createdAt))}
                      </td>
                    </tr>
                    
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
