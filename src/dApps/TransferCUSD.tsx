import { useEffect, useState } from "react";
import { ethers } from "ethers";


// Testnet address of cUSD
const CUSD_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

export default function TransferCUSD() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(
    null
  );
  const [account, setAccount] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [errorPopup, setErrorPopup] = useState<string | null>(null);



  const connectWalletHandler = async () => {
    try {
      // Connect to the provider of your choice (e.g., MetaMask)
      const connectedProvider = new ethers.providers.Web3Provider(
        window.ethereum
      );

      // Set the provider and the connected account
      setProvider(connectedProvider);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const transferCUSD = async () => {
    try {
      if (!provider) {
        console.error("Wallet not connected");
        return;
      }

      if (!receiverAddress || !amount) {
        setErrorPopup("Please enter wallet address and amount.");
        return;
      }

      const iface = new ethers.utils.Interface([
        "function transfer(address to, uint256 value)",
      ]);

      const calldata = iface.encodeFunctionData("transfer", [
        receiverAddress,
        ethers.utils.parseEther(amount), // Convert user-specified amount to wei
      ]);

      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: CUSD_ADDRESS,
        data: calldata,
      });

      // Wait until tx confirmation and get tx receipt
      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);

      // Fetch and display the updated balance after the transaction
      const balance = await provider.getBalance(account);
      console.log("Updated Balance:", ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const connectToWallet = async () => {
      if (window.ethereum) {
        await connectWalletHandler();
      }
    };
    connectToWallet();
  }, []);

  const closePopup = () => {
    setErrorPopup(null);
  };

  return (
    <main style={{ width: "80%", padding: "20px" }}>
      <p
        style={{
          fontSize: "24px",
          textAlign: "center",
          fontWeight: 600,
          color: "#56575c",
        }}
      >
        Send Money
      </p>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <label htmlFor="transfer">Enter Wallet Address</label>

          <input
            type="text"
            id="transfer"
            value={receiverAddress}
            style={{
              background: "#d3d5e0",   
              padding: "10px",
              outline: "none",
              borderRadius: "10px",
            }}
            onChange={(e) => setReceiverAddress(e.target.value)}
          />
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <label htmlFor="amount">Enter Amount (cUSD)</label>

          <input
            type="text"
            id="amount"
            style={{
              background: "#d3d5e0",
              padding: "10px",
              outline: "none",
              borderRadius: "10px",
            }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>{" "}
        <button
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "10px ",
            background: "#6477e0",
            color: "#fff",
            border: "none",
            fontSize: "16px",
            borderRadius: "10px",
            fontWeight: "600",
          }}
          onClick={transferCUSD}
        >
          Transfer cUSD
        </button>
      </div>
      {errorPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#FF0000",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            zIndex: 9999,
          }}
        >
          <p>{errorPopup}</p>
          <button onClick={closePopup}>Close</button>
        </div>
      )}
    </main>
  );
}
