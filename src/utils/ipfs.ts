import FormData from "form-data";
import axios from "axios";
import { Buffer } from "buffer";

export const ipfsUpload = async (ipfsUrl: string, content: string) => {
  if (!content) throw new Error("No content to upload");

  const formData = new FormData();
  const buff = Buffer.from(content);

  formData.append("data", Buffer.from(buff));

  const result = await axios.post(
    ipfsUrl.replace("+ipfs", "") + "/api/v0/add",
    formData
  );

  console.log("uploaded", result.statusText, result.data.Hash);

  return result.data.Hash;
};
