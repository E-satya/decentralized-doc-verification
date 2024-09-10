// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


// Uncomment this line to use console.log
// import "hardhat/console.sol";
contract DocumentVerification {
    struct Document {
        string hash; // Ipfs hash
        address uploader;
        uint256 timestamp;
    }

    mapping(string => Document) public documents;
    //Event to emit when a documen is uploaded

    event DocumentUploaded(string hash, address uploader, uint256 timestamp);

    //function to upload document hash
    function uploadDocument(string memory hash) public {
        require(bytes(hash).length > 0, "Hash cannot be empty");
        require(
            documents[hash].uploader == address(0),
            "Document already exists"
        );

        documents[hash] = Document(hash, msg.sender, block.timestamp);
        emit DocumentUploaded(hash, msg.sender, block.timestamp);
    }

    //function to  verifiy if a document exists
    function verifyDocument(
        string memory hash
    ) public view returns (bool, address, uint256) {
        if (documents[hash].uploader != address(0)) {
            Document memory doc = documents[hash];
            return (true, doc.uploader, doc.timestamp);
        } else {
            return (false, address(0), 0);
        }
    }
}
