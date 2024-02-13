import { useEffect, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { getUsers } from "../../slices/users";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "@chakra-ui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Users({ onData }) {
  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const users = useSelector((state) => state.users.users);
  const isLoading = useSelector((state) => state.users.isLoading);

  const filteredPeople =
    query === ""
      ? users
      : users.filter((person) => {
          return person.username.toLowerCase().includes(query.toLowerCase());
        });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    onData(selectedPerson);
  }, [selectedPerson]);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Spinner size="sm" />
        </div>
      ) : (
        <Combobox as="div" value={selectedPerson} onChange={setSelectedPerson}>
          <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
            Select a person
          </Combobox.Label>
          <div className="relative mt-2">
            <Combobox.Input
              className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(person) => person?.name}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
              <ChevronUpDownIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>

            {filteredPeople.length > 0 && (
              <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredPeople.map((person) => (
                  <Combobox.Option
                    key={person._id}
                    value={person}
                    className={({ active }) =>
                      classNames(
                        "relative cursor-default select-none py-2 pl-3 pr-9",
                        active ? "bg-indigo-600 text-white" : "text-gray-900"
                      )
                    }
                  >
                    {({ active, selected }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(
                              "inline-block h-2 w-2 flex-shrink-0 rounded-full",
                              person.online ? "bg-green-400" : "bg-gray-200"
                            )}
                            aria-hidden="true"
                          />
                          <span
                            className={classNames(
                              "ml-3 truncate",
                              selected && "font-semibold"
                            )}
                          >
                            {person.username}
                          </span>
                        </div>

                        {selected && (
                          <span
                            className={classNames(
                              "absolute inset-y-0 right-0 flex items-center pr-4",
                              active ? "text-white" : "text-indigo-600"
                            )}
                          >
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}
          </div>
        </Combobox>
      )}
      {selectedPerson && (
        <div className="mt-4">
          <div className="flex items-center">
            <span className="flex-shrink-0 inline-block w-2 h-2 bg-green-400 rounded-full" />
            <p>
              Selected:{" "}
              <span className="italic text-green">
                {selectedPerson.username}
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
