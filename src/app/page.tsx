"use client";

import styles from "./page.module.css";
import {
  useStorageUpload,
  useContract,
  useAddress,
  useDisconnect,
  useContractWrite,
  Web3Button,
} from "@thirdweb-dev/react";
import { useState } from "react";

import { abi } from "./constant/abi";

interface Document {
  hash: string;
  verified: boolean;
  base64?: string;
}

export default function Home() {
  const myContractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

  const { mutateAsync: upload } = useStorageUpload();
  const { contract } = useContract(myContractAddress, abi);

  const { mutateAsync, isLoading, error } = useContractWrite(
    contract,
    "uploadDocument"
  );
  const { mutateAsync: verifyDocument, isLoading: verfiyLoading } =
    useContractWrite(contract, "verifyDocument");

  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  // const [uploadedURI, setUploadedURI] = useState("");
  // const [uploading, setUploading] = useState(false);
  const address = useAddress();
  const disconnect = useDisconnect();

  const handleUploadClick = async () => {
    if (file) {
      try {
        const uris = await uploadFile(file);

        const ipfsHash = uris[0].replace(/^ipfs:\/\//, "").split("/")[0];
        await mutateAsync({ args: [ipfsHash] });

        // @ts-ignore
        setDocuments((prev) => [...prev, { hash: ipfsHash, verified: false }]);
        alert("Document uploaded and stored on blockchain successfully!");
      } catch (error: any) {
        if (error?.message) {
          alert(
            "MetaMask Error: The selected document with this IPFS hash has already been uploaded to the blockchain."
          );
        } else {
          alert("An unknown error occurred during the upload.");
        }
      } finally {
        //setUploading(false);
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

  const handleFileChange = (event: any) => {
    if (event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleVerifyClick = async (hash: string) => {
    try {
      console.log(hash, " hash");
      const result = await verifyDocument({ args: [hash] });
      console.log(result, "result");

      // @ts-ignore

      const exists = result[0];
      console.log(exists, "exists");
      // @ts-ignore

      const uploader = result[1];
      console.log(uploader, "uploader");
      // @ts-ignore

      if (exists) {
        setDocuments((prevDocs) =>
          prevDocs.map((doc) =>
            doc.hash === hash ? { ...doc, verified: true } : doc
          )
        );
      } else {
        alert("Document not found or not verified");
      }
    } catch (error) {
      console.error("Error during verification:", error);
    }
  };

  return (
    <div className={styles.container}>
      {/* <h1 className={styles.header}>Welcome to Document Verify</h1> */}
      <header className={styles.header}>
        <h1>Welcome to Document Verify</h1>
        <div className={styles.headerActions}>
          {address ? (
            <div className={styles.address}>
              <p>{address}</p>
              <button
                className={styles.disconnectButton}
                onClick={() => disconnect()}
              >
                Disconnect
              </button>
            </div>
          ) : (
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
              contractAddress={myContractAddress}
              action={() => {}}
            >
              Connect Wallet
            </Web3Button>
          )}
        </div>
      </header>

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
          contractAddress={myContractAddress}
          action={handleUploadClick}
        >
          {" "}
          {isLoading ? "Uploading..." : "Upload"}
        </Web3Button>
      </div>
      <div className={styles.divider}></div>

      <div className={styles.documentList}>
        <h2>Uploaded Documents</h2>
        {documents.length === 0 && <p>No documents uploaded yet.</p>}
        {documents.map((doc, index) => (
          <div key={index} className={styles.documentItem}>
            <p>
              <strong>IPFS Hash: </strong>
              {doc.hash}
            </p>
            {doc.verified ? (
              <span className={styles.verifiedBadge}>✔ Verified</span>
            ) : (
              <Web3Button
                style={{
                  backgroundColor: "#28a745",
                  color: "black",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  border: "none",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                contractAddress={myContractAddress}
                action={() => handleVerifyClick(doc.hash)}
              >
                {verfiyLoading ? "Verifying..." : "Verify"}
              </Web3Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
