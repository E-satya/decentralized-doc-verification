"use client";
import { ChainId, MediaRenderer, ThirdwebProvider } from "@thirdweb-dev/react";
import styles from "./page.module.css";
import { useStorageUpload, useContract } from "@thirdweb-dev/react";
import { useState } from "react";

export default function Home() {
  const { mutateAsync: upload } = useStorageUpload();
  const { contract } = useContract(
    "0x01a1c045175bDA62F1E246a028353251e0541f45"
  );

  const [file, setFile] = useState(null);
  const [uploadedURI, setUploadedURI] = useState("");

  const handleUploadClick = async () => {
    if (file) {
      try {
        console.log("Uploading file:", file);
        const uris = await uploadFile(file);
        if (uris && uris.length > 0) {
          const ipfsHash = uris[0];
          console.log(ipfsHash, "hash");
          setUploadedURI(ipfsHash);
         // await storeHashInContract(ipfsHash);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };
  const uploadFile = async (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const dataToUpload = new Uint8Array(reader.result as ArrayBuffer);
          const uris = await upload({ data: [dataToUpload] });
          resolve(uris);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsArrayBuffer(file);
    });
  };

  const storeHashInContract = async (ipfsHash: string) => {
    if (!contract) {
      console.error("Contract not found");
      return;
    }

    try {
      console.log("Storing hash in contract:", ipfsHash);

      const hash = ipfsHash.replace(/^ipfs:\/\//, "").split("/")[0];
      console.log(hash, "hash");
      // @ts-ignore
      //const tx = await contract.uploadDocument(hash);
      // await tx.wait(); // Wait for transaction to be mined
      console.log("Hash stored in contract successfully");
    } catch (error) {
      console.error("Error storing hash in contract:", error);
    }
  };

  const handleFileChange = (event: any) => {
    if (event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleVerifyClick = () => {
    console.log("Verify Document clicked");
    // Implement verify document functionality here
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Document Management</h1>
        <div className={styles.ctas}>
          <input
            type="file"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          <button className={styles.primaryButton} onClick={handleUploadClick}>
            Document upload
          </button>
          <button
            className={styles.secondaryButton}
            //onClick={handleVerifyClick}
          >
            Verify Document
          </button>
        </div>
        {uploadedURI && (
          <div>
            <h2>Uploaded Document</h2>
            <MediaRenderer src={uploadedURI} />
          </div>
        )}
      </main>
    </div>
  );
}
