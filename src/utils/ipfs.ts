import FormData from "form-data";
import axios, { AxiosRequestConfig } from "axios";
import { Buffer } from "buffer";

export const ipfsUpload = async (ipfsUrl: string, content: string) => {
  if (!content) throw new Error("No content to upload");

  const url = new URL("/api/v0/add", ipfsUrl);
  const opts: AxiosRequestConfig = {};

  if (url.username) {
    opts.auth = {
      username: url.username,
      password: url.password,
    };
  }

  const formData = new FormData();
  const buff = Buffer.from(content);

  formData.append("data", Buffer.from(buff));

  const result = await axios.post(url.toString(), formData, opts);

  console.log("uploaded", result.statusText, result.data.Hash);

  return result.data.Hash;
};
