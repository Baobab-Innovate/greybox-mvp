import { utils } from "ethers";
import { useState } from "react";

//testnet address of cusd
const CUSD_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";




export default function TransferCUSD() {
  const [receiverAddress, setReceiverAddress] = useState("");
    async function transferCUSD() {
        if (window.ethereum) {
            // Get connected accounts, if not connected request connnection.
            // returns an array of accounts
            let accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            // The current selected account out of the connected accounts.
            let userAddress = accounts[0];

            let iface = new utils.Interface([
                "function transfer(address to, uint256 value)",
            ]);

            // let calldata = iface.encodeFunctionData("transfer", [
            //     receiverAddress,
            //     utils.parseEther("0.1"), // 10 cUSD - This amount is in wei
            // ]);
            let calldata = iface.encodeFunctionData("transfer", [
              receiverAddress,
              utils.parseEther("0.1"), // 10 cUSD - This amount is in wei
            ]);

            // Send transaction to the injected wallet to be confirmed by the user.
            let tx = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [
                    {
                        from: userAddress,
                        to: CUSD_ADDRESS, // We need to call the transfer function on the cUSD token contract
                        data: calldata, // Information about which function to call and what values to pass as parameters
                    },
                ],
            });

            // Wait until tx confirmation and get tx receipt
            let receipt = await tx.wait();
        }
    }
    return (

    // return <button onClick={transferCUSD}>Transfer cUSD</button>;
    <main>
    <label htmlFor="transfer">Enter Wallet Address</label>
    <br />
    <input
      type="text"
      id="transfer"
      value={receiverAddress}
      onChange={(e) => setReceiverAddress(e.target.value)}
    />
    <br />
    <button onClick={TransferCUSD}>Transfer cUSD</button>
  </main>
);

}