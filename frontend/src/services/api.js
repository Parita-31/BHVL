import axios from "axios";

export const processAudio = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post("http://127.0.0.1:8000/process", formData);
  return res.data;
};