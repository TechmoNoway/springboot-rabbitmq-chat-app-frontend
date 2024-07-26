const url = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_API_CLOUDINARY_CLOUD_NAME
}/auto/upload`;

const uploadFile = async (file: string | Blob) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "civic-chat-app");

  const response = await fetch(url, {
    method: "post",
    body: formData,
  });
  const responseData = await response.json();
  console.log(response);

  return responseData;
};

export default uploadFile;
