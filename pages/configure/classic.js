import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import boxService from "../../api/box.service";
import { useToast } from "@chakra-ui/react";
import Head from "next/head";

export default function BoxViewer() {
  const [box, setBox] = useState(null);
  const toast = useToast();

  const getBox = async () => {
    await boxService
      .getAllCoinboxes()
      .then((boxes) => {
        console.log(boxes.data);
        const exclusiveBox = boxes.data.filter(
          (box) => box.boxType === "Classic"
        );
        setBox(exclusiveBox[0]);
        console.log(exclusiveBox[0]);
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "There was an error fetching the box",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    getBox();
  }, []);

  const editBox = async () => {
    if (box?.id) {
      try {
        await boxService.updateCoinbox(box.id, box);
        toast({
          title: "Box Updated",
          description: "The box has been updated",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
                location.href = "/boxes";
      } catch (error) {
        toast({
          title: "Error",
          description: "There was an error updating the box",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } else {
      try {
        await boxService.createCoinbox(box);
        toast({
          title: "Box Created",
          description: "The box has been created",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
                location.href = "/boxes";
      } catch (error) {
        toast({
          title: "Error",
          description: "There was an error creating the box",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <Head>
        <title>Coindraw Admin</title>
        <meta name="description" content="Coindraw Administration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="mb-2">
          <div className="mx-auto max-w-7xl ">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Exclusive Box Editor
            </h1>
          </div>
        </div>
        <div className="p-4 space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div>
                <h3 className="text-2xl font-semibold leading-6 text-green">
                  {box?.boxType} Box
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>

              <div className="grid grid-cols-2 mt-6 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="boxType"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Box Type
                  </label>
                  <div className="mt-1">
                    <select
                      id="boxType"
                      name="boxType"
                      value={box?.boxType}
                      onChange={(e) =>
                        setBox({ ...box, boxType: e.target.value })
                      }
                      className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option>Classic</option>
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="prize"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Prize
                  </label>
                  <div className="flex mt-2 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="prize"
                      id="prize"
                      autoComplete="prize"
                      value={box?.prize}
                      onChange={(e) =>
                        setBox({ ...box, prize: e.target.value })
                      }
                      className="block w-full min-w-0 flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="prizeImage"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Prize Image
                  </label>
                  <div className="flex mt-2 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="prizeImage"
                      id="prizeImage"
                      autoComplete="prizeImage"
                      value={box?.prizeImage}
                      onChange={(e) =>
                        setBox({ ...box, prizeImage: e.target.value })
                      }
                      className="block w-full min-w-0 flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="prizeQuantity"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Prize Quantity
                  </label>
                  <div className="flex mt-2 rounded-md shadow-sm">
                    <input
                      type="number"
                      name="prizeQuantity"
                      id="prizeQuantity"
                      autoComplete="prizeQuantity"
                      value={box?.prizeQuantity}
                      onChange={(e) =>
                        setBox({ ...box, prizeQuantity: e.target.value })
                      }
                      className="block w-full min-w-0 flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="prizeProbability"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Prize Probability
                  </label>
                  <div className="flex mt-2 rounded-md shadow-sm">
                    <input
                      type="number"
                      name="prizeProbability"
                      id="prizeProbability"
                      autoComplete="prizeProbability"
                      value={box?.prizeProbability}
                      onChange={(e) =>
                        setBox({ ...box, prizeProbability: e.target.value })
                      }
                      className="block w-full min-w-0 flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="discordNotificationType"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Discord Notification Type
                  </label>
                  <div className="flex mt-2 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="discordNotificationType"
                      id="discordNotificationType"
                      autoComplete="discordNotificationType"
                      value={box?.discordNotificationType}
                      onChange={(e) =>
                        setBox({
                          ...box,
                          discordNotificationType: e.target.value,
                        })
                      }
                      className="block w-full min-w-0 flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                onClick={() => editBox()}
                className="px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
