// import PayTokenFunctionCall from "./dApps/PayTokenFunctionCall";
import TransferCUSD from "./dApps/TransferCUSD";
export default function App() {
  return (
    <div
      style={{
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "400px",
        gap: "12px",
        background: "#fff",
        height: "100vh",
        paddingTop: "20px",
      }}
    >
      <img src="./greyboxlogo.jpeg" alt="" width={"200px"} />

      <TransferCUSD />
    </div>
  );
}
