import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { AppKitNetwork, holesky } from "@reown/appkit/networks";

const projectId = import.meta.env.VITE_PROJECT_ID;

const networks: [AppKitNetwork] = [holesky]

const metadata = {
  name: "Roomie", 
  description: "Web3 proj",
  url: "http://127.0.0.1:5173",
  icons: ["https://avatars.roomie.com/"],
}

createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId
})

function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Roomie Frontend!</h1>
    </>
  )
}

export default App
