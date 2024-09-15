"use client";
import {
  ChainId,
  MediaRenderer,
  ThirdwebProvider,
  ThirdwebSDK,
} from "@thirdweb-dev/react";
import styles from "./page.module.css";
import {
  useStorageUpload,
  useContract,
  useContractWrite,
  Web3Button,
} from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
//import { IpfsUploader } from "@thirdweb-dev/storage";
import { abi } from "./constant/abi";
import { sep } from "path";
interface Document {
  hash: string;
  verified: boolean;
  base64?: string;
}

export default function Home() {
  const { mutateAsync: upload } = useStorageUpload();
  const { contract } = useContract(
    "0x01a1c045175bDA62F1E246a028353251e0541f45",
    abi
  );

  const { mutateAsync, isLoading, error } = useContractWrite(
    contract,
    "uploadDocument"
  );

  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadedURI, setUploadedURI] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUploadClick = async () => {
    if (file) {
      try {
        console.log("Uploading file:", file);
        const uris = await uploadFile(file);
        setUploadedURI(uris[0]);
        const ipfsHash = uris[0].replace(/^ipfs:\/\//, "").split("/")[0];
        await mutateAsync({ args: [ipfsHash] });
        // @ts-ignore
        setDocuments((prev) => [...prev, { hash: ipfsHash, verified: false }]);
        alert("Document uploaded and stored on blockchain successfully!");
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setUploading(false);
      }
    } else {
      alert("Please select a file to upload");
    }
  };

  const uploadFile = async (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const dataToUpload = new Uint8Array(reader.result as ArrayBuffer);
          const uris = await upload({ data: [dataToUpload] });
          console.log("File uploaded successfully:", uris);
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

      // await tx.wait(); // Wait for transaction to be mined
      console.log("Hash stored in contract successfully");
      const tx = await contract.abi;
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
    <div className={styles.container}>
      <h1 className={styles.header}>Welcome to Document Verify</h1>

      <div className={styles.uploadSection}>
        <input type="file" onChange={handleFileChange} />

        <Web3Button
          style={{
            backgroundColor: "#007bff",
            color: "black",
            padding: "8px 16px",
            borderRadius: "5px",
            border: "none",
            fontSize: "14px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          contractAddress={"0x01a1c045175bDA62F1E246a028353251e0541f45"}
          action={handleUploadClick}
          //disabled={uploading || isLoading}
        >
          {" "}
          {uploading || isLoading ? "Uploading..." : "Upload"}
        </Web3Button>
      </div>

      <div className={styles.documentList}>
        <h2>Uploaded Documents</h2>
        {documents.length === 0 && <p>No documents uploaded yet.</p>}
        {documents.map((doc, index) => (
          <div key={index} className={styles.documentItem}>
            <p>IPFS Hash: {doc.hash}</p>
            {doc.verified ? (
              <span className={styles.verifiedBadge}>✔ Verified</span>
            ) : (
              <div>
                <button className={styles.verifyButton}>Verify</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
