import { useEffect, useState } from "react";
import DeleteUser from "../modal/deleteUser";
import userService from "../../api/user.service";
import CsvDownloader from "react-csv-downloader";

export default function UsersTable(data) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const fetchUsers = () => {
    userService.getAll().then((res) => {
      setUsers(res?.data);
    });
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredData(
      users.filter(
        (u) =>
          u?.name?.toLowerCase().includes(search.toLowerCase()) ||
          u?.address?.toLowerCase().includes(search.toLowerCase()) ||
          u?.email?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  return (
    <>
      <div className="my-2 ">
        <CsvDownloader
          datas={users}
          filename="users"
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
            Users
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            This is a comprehensive list of all registered users in the system.
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
                      Username
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Address
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Referred
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Promos
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Created On
                    </th>

                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    ></th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredData.map((person) => (
                    <tr key={person.email}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-3">
                        {person?.username}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {person.email}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {person?.walletAddress && (
                          <span className="flex items-center ">
                            {person?.walletAddress?.slice(0, 8)}...
                            {person?.walletAddress?.slice(-3)}
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  person.walletAddress
                                )
                              }
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
                                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                                />
                              </svg>
                            </button>
                          </span>
                        )}
                      </td>
                      {/* <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {person?.countryCode} {person?.phone}
                      </td>
                     
                      */}{" "}
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {person?.referred ? "Yes" : "No"}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {person?.promotionalEmails ? "Yes" : "No"}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(person.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-sm font-medium text-right ">
                        <DeleteUser user={person.id} fetchUsers={fetchUsers} />
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
