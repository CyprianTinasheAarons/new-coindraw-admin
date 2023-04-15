import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";

export default function EditImage({ url }) {
  const [bannerImage, setBannerImage] = useState("");
  const [banner, setBanner] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  function handleBannerChange(e) {
    setBanner(URL.createObjectURL(e.target.files[0]));
    setBannerImage(e.target.files[0]);
  }

  const uploadBannerImage = async () => {
    setIsLoading(true);
    const data = new FormData();
    data.append("file", bannerImage);
    data.append("upload_preset", "coindraw");
    data.append("cloud_name", "dqzpz4w3l");

    await fetch("https://api.cloudinary.com/v1_1/dqzpz4w3l/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("draw_image", JSON.stringify(data.url));
        toast({
          title: "Image Uploaded.",
          description: "Your draw image has been uploaded!",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Something went wrong.",
          description: "Something went wrong!",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setBanner(url);
  }, [url]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-center w-full">
        <label
          for="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {banner ? (
              <img
                className="object-cover w-full h-64 rounded-lg"
                //remove quotes
                src={banner.replace(/['"]+/g, "")}
                alt="banner"
              />
            ) : (
              <>
                <svg
                  aria-hidden="true"
                  className="w-10 h-10 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload Image</span>{" "}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </>
            )}
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={(event) => {
              handleBannerChange(event);
            }}
          />
        </label>
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={() => uploadBannerImage()}
        >
          {isLoading ? <Spinner size="sm" /> : "Upload Image"}
        </button>
      </div>
    </div>
  );
}
