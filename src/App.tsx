import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { openFolder, startWatchingForFiles } from "./utils";
import { open } from "@tauri-apps/api/dialog";


const scs = new Set<string>();


function App() {
  const [userScrDir, setUserScrDir] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    console.log('scr dir', userScrDir);
    if (!userScrDir) return
    (async () => {
      await startWatchingForFiles(scs, userScrDir);
    }
    )()
  }, [userScrDir])


  return (
    <div className="container">

      <div className="row">

        <button
          onClick={async () => {
            const selectedDir = await openFolder()
            console.log('scrDir', selectedDir)
            setUserScrDir(selectedDir as string);
          }}
        >
          select screeshot folder to monitor
        </button>
        {/* <input
        type={'number'}
        onChange={() => {

        }}
        defaultValue={10}
        placeholder="set time for deleting the screen shot in seconds"
      /> */}
      </div>
    </div>
  );
}

export default App;
