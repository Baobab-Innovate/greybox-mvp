import { utils } from "ethers";
import { useState } from "react";

// Testnet address of cUSD
const CUSD_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

export default function TransferCUSD() {
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");

  async function transferCUSD() {
    if (window.ethereum) {
      try {
        // Request the user's accounts directly from MetaMask
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length === 0) {
          console.error("No accounts found");
          return;
        }

        // The current selected account out of the connected accounts.
        const userAddress = accounts[0];

        const iface = new utils.Interface([
          "function transfer(address to, uint256 value)",
        ]);

        const calldata = iface.encodeFunctionData("transfer", [
          receiverAddress,
          utils.parseEther(amount), // Convert user-specified amount to wei
        ]);

        // Send transaction to the injected wallet to be confirmed by the user.
        const tx = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: userAddress,
              to: CUSD_ADDRESS,
              data: calldata,
            },
          ],
        });

        // Wait until tx confirmation and get tx receipt
        const receipt = await tx.wait();
        console.log("Transaction receipt:", receipt);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }

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
    </main>
  );
}
