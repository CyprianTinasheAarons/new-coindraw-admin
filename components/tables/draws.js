import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import CsvDownloader from "react-csv-downloader";
import drawService from "../../api/draw.service";

export default function DrawsTable() {
  const [draws, setDraws] = useState([]);
  const [filter, setFilter] = useState("all");

  const handleUpdateDraws = async (newRowOrder) => {
    //map the new order and to draw id
    const newDrawOrder = newRowOrder.map((draw, index) => {
      return {
        id: draw.id,
        order: index,
      };
    });

    //update the draw order
    await drawService
      .updateDrawOrder(newDrawOrder)
      .then(() => {
        getDraws();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDraws = async () => {
    await drawService.getAll().then((res) => {
      const byOrder = res.data.sort((a, b) => a.order - b.order);
      setDraws(byOrder);
    });
  };

  const reorder = (startIndex, endIndex) => {
    const result = Array.from(draws);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    result.map((row, index) => (row.order = index));
    return result;
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!result.destination) {
      return;
    }
    const update = reorder(source.index, destination.index);

    setDraws(update);
    handleUpdateDraws(update);
  };

  useEffect(() => {
    getDraws();
  }, []);

  //toggle live draws filter
  useEffect(() => {
    if (filter === "all") {
      drawService.getAll().then((res) => {
        const byOrder = res.data.sort((a, b) => a.order - b.order);
        setDraws(byOrder);
      });
    } else if (filter === "yes") {
      drawService.getAll().then((res) => {
        const byOrder = res.data.sort((a, b) => a.order - b.order);
        setDraws(byOrder.filter((draw) => draw.live === true));
      });
    } else if (filter === "no") {
      drawService.getAll().then((res) => {
        const byOrder = res.data.sort((a, b) => a.order - b.order);
        setDraws(byOrder.filter((draw) => draw.live === false));
      });
    }
  }, [filter]);

  return (
    <>
      <div className="my-2 ">
        <CsvDownloader
          datas={draws}
          filename="draws"
          extension=".csv"
          separator=";"
          wrapColumnChar="'"
        >
          <button className="flex items-center px-4 py-2 text-white align-middle bg-blue-500 rounded-md">
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
        <span className="pr-2 font-semibold"> Filter By Live Draws</span>
        <form className="flex items-center align-middle">
          <div className="flex items-center p-1 align-middle">
            <input
              type="radio"
              id="all"
              name="color"
              value="all"
              checked={filter === "all"}
              onChange={() => setFilter("all")}
            />
            <label htmlFor="all" className="px-1 font-semibold">
              All
            </label>
          </div>
          <div className="flex items-center p-1 align-middle">
            <input
              type="radio"
              id="yes"
              name="color"
              value="yes"
              checked={filter === "yes"}
              onChange={() => setFilter("yes")}
            />
            <label htmlFor="yes" className="px-1 font-semibold">
              Yes
            </label>
          </div>
          <div className="flex items-center p-1 align-middle">
            <input
              type="radio"
              id="no"
              name="color"
              value="no"
              checked={filter === "no"}
              onChange={() => setFilter("no")}
            />
            <label htmlFor="no" className="px-1 font-semibold">
              No
            </label>
          </div>
        </form>
      </div>
      <div className="px-6 lg:px-8">
        <div className="flow-root mt-8">
          <div className="-mx-6 -my-2 overflow-x-auto lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-6 pr-3 text-left text-sm font-bold text-gray-900 sm:pl-0"
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
                          d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                        />
                      </svg>
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Type
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
                      Max Odd
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900 "
                    >
                      Live
                    </th>

                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-6 sm:pr-0"
                    >
                      Date Created
                    </th>

                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-6 sm:pr-0"
                    >
                      <span className="">Action</span>
                    </th>
                  </tr>
                </thead>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="dndTableBody">
                    {(provided) => (
                      <tbody
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="divide-y divide-gray-200"
                      >
                        {draws.map((draw, index) => (
                          <Draggable
                            key={draw.id}
                            draggableId={draw.id}
                            index={index}
                          >
                            {(provided) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white"
                              >
                                <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
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
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </td>
                                <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                  {draw.title}
                                </td>
                                <td className="px-3 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                  {draw.type}
                                </td>
                                <td className="px-3 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                  {draw.maxprice}
                                </td>
                                <td className="px-3 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                  {draw.maxodds}
                                </td>
                                <td className="px-3 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                  {draw.live ? "Yes" : "No"}
                                </td>
                                <td className="px-3 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                  {new Date(
                                    draw.createdAt
                                  ).toLocaleDateString()}
                                </td>
                                <td className="px-3 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                  <a
                                    className="px-2 py-2 text-sm font-medium text-white rounded-md bg-green hover:bg-green"
                                    href={`/viewdraw/${draw.id}`}
                                  >
                                    View Draw
                                  </a>
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </tbody>
                    )}
                  </Droppable>
                </DragDropContext>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
