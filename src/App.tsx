import { Button, Container, NextUIProvider, Spacer } from "@nextui-org/react";
import { useEffect, useState } from "react";

import { Input } from "./components/Input";
import { Textarea } from "./components/Textarea";
import { ipfsUpload } from "./utils/ipfs";

export function App() {
  const [ipfsUrl, setIpfsUrl] = useState("http://localhost:5001");
  const [content, setContent] = useState("");

  const [valid, setValid] = useState(ipfsUrl && content);
  const [uploading, setUploading] = useState(false);

  useEffect(() => setValid(ipfsUrl && content), [ipfsUrl, content]);

  async function upload() {
    if (uploading) return;
    setUploading(true);

    try {
      const hash = await ipfsUpload(ipfsUrl, content);
    } finally {
      setUploading(false);
    }
  }

  return (
    <NextUIProvider>
      <Container xs>
        <Input
          name="ipfsUrl"
          value={ipfsUrl}
          label={"IPFS Url:"}
          placeholder={"Enter and ipfs url..."}
          onChange={setIpfsUrl}
          required
        />
        <Spacer />
        <Textarea
          name="content"
          value={content}
          label={"Content:"}
          placeholder={"Enter file content..."}
          onChange={setContent}
          required
        />
        <Spacer />
        <Button
          css={{ minWidth: "100%" }}
          disabled={!valid || uploading}
          onPress={upload}
        >
          Upload
        </Button>
      </Container>
    </NextUIProvider>
  );
}
