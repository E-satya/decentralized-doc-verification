"use client";

import styles from "./page.module.css";
import {
  useStorageUpload,
  useContract,
  useContractWrite,
  Web3Button,
} from "@thirdweb-dev/react";
import {  useState } from "react";

import { abi } from "./constant/abi";

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
  const { mutateAsync: verifyDocument, isLoading: verfiyLoading } =
    useContractWrite(contract, "verifyDocument");

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


  const handleFileChange = (event: any) => {
    if (event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleVerifyClick = async (hash: string) => {
    try {
      const result = await verifyDocument({ args: [hash] });

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
                contractAddress={"0x01a1c045175bDA62F1E246a028353251e0541f45"}
                action={() => handleVerifyClick(doc.hash)}
                // disabled={isVerifyLoading}
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
