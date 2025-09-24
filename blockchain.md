# Blockchain Implementation for Supply Setu (Sepolia Testnet)

This document outlines the high-level steps and considerations for implementing blockchain features – **Product Traceability** and **Immutable Reviews** – for "Supply Setu" using the **Sepolia Testnet**.

## 1. Choose Your Blockchain Stack

*   **Smart Contract Language:** Solidity (most common for EVM-compatible chains like Sepolia).
*   **Development Framework:** Hardhat or Foundry are excellent choices for local development, testing, and deployment.
*   **Web3 Library:** Ethers.js (for JavaScript/TypeScript) or Web3.js to interact with the deployed contracts from your backend/frontend.

## 2. Smart Contract Development

### Contract 1: Product Traceability

This contract will manage the lifecycle and movement of products/ingredients.

**Key Data Structures:**

*   `struct ProductBatch`: To store details of a product batch (e.g., `batchId`, `supplierId`, `productId`, `productionDate`, `originInfo`, `status` - e.g., 'created', 'in_transit', 'received').
*   `struct TransferEvent`: To log each transfer of a product batch (e.g., `batchId`, `fromId`, `toId`, `transferDate`, `quantity`).

**Key Functions:**

*   `registerProductBatch(string _batchId, string _productId, address _supplierAddress, string _originInfo, uint256 _productionDate)`:
    *   Called by a registered supplier to create a new product batch record on-chain.
    *   Emits a `ProductBatchRegistered` event.
*   `transferProductBatch(string _batchId, address _fromAddress, address _toAddress, uint256 _quantity)`:
    *   Called by the current owner (supplier or vendor) to record the transfer of a specific product batch to another registered entity.
    *   Verifies ownership.
    *   Updates the `status` of the batch.
    *   Emits a `ProductBatchTransferred` event.
*   `getProductBatchDetails(string _batchId)`:
    *   Allows anyone to query the details of a specific product batch.
*   `getProductBatchHistory(string _batchId)`:
    *   Allows querying all transfer events related to a specific product batch.

**Considerations:**

*   **Identity Management:** How will `supplierId` and `vendorId` map to actual blockchain addresses? You might have an `IdentityRegistry` contract or use a mapping in the `ProductTraceability` contract itself (e.g., `mapping(address => string) public addressToEntityId;`).
*   **Access Control:** Use OpenZeppelin's `Ownable` or `AccessControl` contracts to restrict who can call functions like `registerProductBatch` or `transferProductBatch` (e.g., only registered suppliers/vendors).
*   **Events:** Emit events for every significant action (`ProductBatchRegistered`, `ProductBatchTransferred`, etc.) to allow off-chain applications to easily track changes and build historical views.

### Contract 2: Immutable Reviews

This contract will store customer reviews immutably.

**Key Data Structures:**

*   `struct Review`: To store review details (e.g., `reviewId`, `productId`, `vendorId`, `customerId`, `rating`, `commentHash`, `timestamp`).
    *   **Note on `commentHash`:** Storing the full review text on-chain is expensive. Instead, store a hash of the review text. The actual text can be stored off-chain (e.g., IPFS, decentralized storage, or even your backend database) and retrieved using the hash for verification.

**Key Functions:**

*   `submitReview(string _productId, address _vendorAddress, uint8 _rating, bytes32 _commentHash)`:
    *   Called by a registered customer to submit a review for a product from a specific vendor.
    *   Emits a `ReviewSubmitted` event.
*   `getReview(string _reviewId)`:
    *   Allows querying a specific review.
*   `getReviewsForProduct(string _productId)`:
    *   Allows querying all reviews for a given product.
*   `getReviewsForVendor(address _vendorAddress)`:
    *   Allows querying all reviews for a given vendor.

**Considerations:**

*   **Review Integrity:** By storing the `commentHash` on-chain, you can prove that the off-chain stored comment hasn't been altered since it was submitted.
*   **Customer Identity:** Ensure `customerId` maps to the customer's blockchain address.
*   **Rating System:** Decide on the scale for `_rating` (e.g., 1-5).

## 3. Local Development and Testing

*   **Set up Hardhat/Foundry project.**
*   **Write comprehensive tests** for both smart contracts to ensure they behave as expected under various scenarios (e.g., successful registration, unauthorized transfers, review submission, review retrieval).

## 4. Deployment to Sepolia Testnet

1.  **Obtain Sepolia ETH:** Get test ETH from a Sepolia faucet (search "Sepolia faucet" online).
2.  **Configure Deployment Script:**
    *   In your Hardhat/Foundry configuration, add a network configuration for Sepolia.
    *   You'll need an **Infura** or **Alchemy** API key to connect to the Sepolia network.
    *   Your deployer account's private key (store securely, e.g., in a `.env` file).
3.  **Deploy Contracts:** Execute your deployment script to deploy `ProductTraceability` and `ImmutableReviews` to the Sepolia testnet.
4.  **Record Contract Addresses:** Save the deployed contract addresses and ABIs (Application Binary Interfaces) for your frontend and backend to interact with.

## 5. Backend Integration

Your Node.js backend will act as an intermediary between your frontend and the smart contracts.

*   **Web3 Library Integration:** Use Ethers.js or Web3.js to interact with your deployed contracts.
*   **Key Backend Tasks:**
    *   **Listen for Events:** Set up listeners for `ProductBatchRegistered`, `ProductBatchTransferred`, `ReviewSubmitted` events. When these events occur, your backend can update its off-chain database (e.g., MongoDB) to maintain a fast, searchable copy of the blockchain data.
    *   **Initiate Transactions:** When a user (supplier or vendor) performs an action that requires a blockchain transaction (e.g., registering a product, transferring a batch, submitting a review), your backend will:
        *   Receive the request from the frontend.
        *   Prepare the transaction (calling the appropriate smart contract function).
        *   Sign the transaction with your backend's wallet (or a user's connected wallet if you implement client-side signing).
        *   Send the signed transaction to the Sepolia network.
        *   Wait for transaction confirmation.
        *   Store off-chain review text (linked by `commentHash`).
    *   **Query Contract Data:** For real-time data that doesn't require a transaction, your backend can directly call read-only functions on the smart contracts.

## 6. Frontend Integration

Your React frontend will display blockchain data and allow users to trigger blockchain transactions (via the backend).

*   **Display Traceability Data:** Show the history of a product batch by fetching data from your backend (which in turn gets it from the blockchain/its synced database).
*   **Display Immutable Reviews:** Show reviews, verifying the `commentHash` if the full text is fetched from an off-chain source.
*   **User Interface for Actions:**
    *   Forms for suppliers to register product batches.
    *   Interfaces for vendors to confirm receipt of product batches.
    *   Forms for customers to submit reviews.
*   **Wallet Connection (Optional but Recommended for Direct User Interaction):** While your backend can handle transactions, for a more "web3 native" experience, you might integrate a wallet connector (e.g., `wagmi`, `Web3Modal`) to allow users to sign transactions directly from their browser wallets (like MetaMask). This can enhance decentralization and user control.

## 7. Security Considerations

*   **Private Key Management:** Securely manage private keys for any backend accounts that send transactions. Never expose them directly in code or commit them to version control.
*   **Input Validation:** Thoroughly validate all inputs to your smart contracts and backend APIs to prevent exploits.
*   **Gas Optimizations:** Write efficient Solidity code to minimize gas costs, especially for functions that will be called frequently.
*   **Reentrancy Guards:** Use OpenZeppelin's `ReentrancyGuard` where applicable to prevent reentrancy attacks.
*   **Oracle Integration (Future):** For real-world data (e.g., temperature sensors for cold chain), you might need oracles (like Chainlink) to bring off-chain data onto the blockchain. (This is advanced and likely for a later stage).

This roadmap provides a solid foundation for integrating blockchain into "Supply Setu" on the Sepolia testnet. Remember to iterate and test thoroughly at each step!
