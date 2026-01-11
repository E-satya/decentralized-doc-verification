"use client";

import styles from "./page.module.css";

import {
  useContract,
  useAddress,
  useDisconnect,
  useContractWrite,
  Web3Button,
} from "@thirdweb-dev/react";
import { useEffect, useRef, useState } from "react";

import { abi } from "./constant/abi";
import { uploadFile } from "../utils/uploadFile";
import { ethers } from "ethers";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import UploadSection from "@/components/upload-section";
import DocumentsList from "@/components/document-list";
import FeaturesSection from "@/components/features-section";
import SecuritySection from "@/components/security-section";
import Footer from "@/components/footer";

interface Document {
  hash: string;
  verified: boolean;
  base64?: string;
}

export default function Home() {
 const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string
  const [address, setAddress] = useState<string | undefined>()
  const [isConnecting, setIsConnecting] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)

  const uploadSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0])
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            setSigner(signer)
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
        }
      }
    }

    checkWalletConnection()
  }, [])

  const handleConnect = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to use this app.")
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setAddress(accounts[0])

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      setSigner(signer)
    } catch (error: any) {
      if (error.code === -32602) {
        alert("Failed to connect to MetaMask")
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setAddress(undefined)
    setSigner(null)
    setDocuments([])
  }

  const handleScrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleUploadClick = async () => {
    if (!file || !signer) {
      alert("Please connect wallet and select a file")
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file")
      }

      const uploadData = await uploadResponse.json()
      const ipfsHash = uploadData.ipfsHash

      const contract = new ethers.Contract(contractAddress, abi, signer)
      const tx = await contract.uploadDocument(ipfsHash)
      await tx.wait()

      setDocuments((prev) => [...prev, { hash: ipfsHash, verified: false }])
      alert("Document uploaded and stored on blockchain successfully!")
      setFile(null)
    } catch (error: any) {
      console.error("Error uploading document:", error)
      alert(`Error uploading document: ${error.message || "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyClick = async (hash: string) => {
    if (!signer) {
      alert("Please connect your wallet")
      return
    }

    setIsVerifying(true)
    try {
      const contract = new ethers.Contract(contractAddress, abi, signer)
      const result = await contract.verifyDocument(hash)

      if (result[0]) {
        setDocuments((prevDocs) => prevDocs.map((doc) => (doc.hash === hash ? { ...doc, verified: true } : doc)))
      } else {
        alert("Document not found or not verified")
      }
    } catch (error: any) {
      console.error("Error during verification:", error)
      alert(`Error verifying document: ${error.message || "Unknown error"}`)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50/30 dark:via-background dark:to-blue-950/20">
      <Header address={address} onConnect={handleConnect} onDisconnect={handleDisconnect} isConnecting={isConnecting} />
      <HeroSection onStartClick={handleScrollToUpload} />
      <div ref={uploadSectionRef}>
        <UploadSection
          file={file}
          onFileChange={setFile}
          onUpload={handleUploadClick}
          isLoading={isLoading}
          isConnected={!!address}
        />
      </div>
      {documents.length > 0 && (
        <DocumentsList documents={documents} onVerify={handleVerifyClick} isVerifying={isVerifying} />
      )}
      <FeaturesSection />
      <SecuritySection />
      <Footer />
    </div>
  )
}


// export default function Home() {
//   const myContractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

//   const { contract } = useContract(myContractAddress, abi);

//   const { mutateAsync, isLoading, error } = useContractWrite(
//     contract,
//     "uploadDocument"
//   );
//   const { mutateAsync: verifyDocument, isLoading: verfiyLoading } =
//     useContractWrite(contract, "verifyDocument");

//   const [file, setFile] = useState(null);
//   const [documents, setDocuments] = useState<Document[]>([]);

//   const address = useAddress();
//   const disconnect = useDisconnect();

//   const handleUploadClick = async () => {
//     if (file) {
//       try {
//         const uris = await uploadFile(file);

//         const ipfsHash = uris[0].replace(/^ipfs:\/\//, "").split("/")[0];
//         await mutateAsync({ args: [ipfsHash] });

//         // @ts-ignore
//         setDocuments((prev) => [...prev, { hash: ipfsHash, verified: false }]);
//         alert("Document uploaded and stored on blockchain successfully!");
//       } catch (error: any) {
//         if (error?.message) {
//           alert(
//             "MetaMask Error: The selected document with this IPFS hash has already been uploaded to the blockchain."
//           );
//         } else {
//           alert("An unknown error occurred during the upload.");
//         }
//       } finally {
//         //setUploading(false);
//       }
//     } else {
//       alert("Please select a file to upload");
//     }
//   };

//   const handleFileChange = (event: any) => {
//     if (event.target.files.length > 0) {
//       setFile(event.target.files[0]);
//     }
//   };

//   const handleVerifyClick = async (hash: string) => {
//     try {
//       const result = await verifyDocument({ args: [hash] });

//       // @ts-ignore

//       const exists = result[0];

//       // @ts-ignore

//       const uploader = result[1];

//       // @ts-ignore

//       if (exists) {
//         setDocuments((prevDocs) =>
//           prevDocs.map((doc) =>
//             doc.hash === hash ? { ...doc, verified: true } : doc
//           )
//         );
//       } else {
//         alert("Document not found or not verified");
//       }
//     } catch (error) {
//       console.error("Error during verification:", error);
//     }
//   };

//   return (
//   <div className={styles.container}>
//       <header className={styles.header}>
//         <h1>Welcome to Document Verify</h1>
//         <div className={styles.headerActions}>
//           {address ? (
//             <div className={styles.address}>
//               <p>{address}</p>
//               <button
//                 className={styles.disconnectButton}
//                 onClick={() => disconnect()}
//               >
//                 Disconnect
//               </button>
//             </div>
//           ) : (
//             <Web3Button
//               style={{
//                 backgroundColor: "#007bff",
//                 color: "black",
//                 padding: "8px 16px",
//                 borderRadius: "5px",
//                 border: "none",
//                 fontSize: "14px",
//                 cursor: "pointer",
//                 transition: "background-color 0.3s ease",
//               }}
//               contractAddress={myContractAddress}
//               action={() => {}}
//             >
//               Connect Wallet
//             </Web3Button>
//           )}
//         </div>
//       </header>

//       <div className={styles.uploadSection}>
//         <input type="file" onChange={handleFileChange} />

//         <Web3Button
//           style={{
//             backgroundColor: "#007bff",
//             color: "black",
//             padding: "8px 16px",
//             borderRadius: "5px",
//             border: "none",
//             fontSize: "14px",
//             cursor: "pointer",
//             transition: "background-color 0.3s ease",
//           }}
//           contractAddress={myContractAddress}
//           action={handleUploadClick}
//         >
//           {" "}
//           {isLoading ? "Uploading..." : "Upload"}
//         </Web3Button>
//       </div>
//       <div className={styles.divider}></div>

//       <div className={styles.documentList}>
//         <h2>Uploaded Documents</h2>
//         {documents.length === 0 && <p>No documents uploaded yet.</p>}
//         {documents.map((doc, index) => (
//           <div key={index} className={styles.documentItem}>
//             <img
//               src={`https://gateway.pinata.cloud/ipfs/${doc.hash}`}
//               alt="Document"
//               style={{ width: "150px", height: "150px" }}
//               onError={(e) => {
//                 // Handle error if the document is not an image
//                 e.currentTarget.src = "/default-preview.png";
//               }}
//             />
//             {doc.verified ? (
//               <span className={styles.verifiedBadge}>✔ Verified</span>
//             ) : (
//               <Web3Button
//                 style={{
//                   backgroundColor: "#28a745",
//                   color: "black",
//                   padding: "8px 16px",
//                   borderRadius: "5px",
//                   border: "none",
//                   fontSize: "14px",
//                   cursor: "pointer",
//                   transition: "background-color 0.3s ease",
//                 }}
//                 contractAddress={myContractAddress}
//                 action={() => handleVerifyClick(doc.hash)}
//               >
              
//             verify
//               </Web3Button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

