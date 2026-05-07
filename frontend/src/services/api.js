import axios from "axios";

export const processAudio = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/process`,
    formData
  );

  return res.data;
};
