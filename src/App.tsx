import { useEffect, useState } from "react";
import "./App.css";
import { openFolder, startWatchingForFiles } from "./utils";
import { invoke } from "@tauri-apps/api/tauri";


const scs = new Set<string>();


function App() {

  const [userScrDir, setUserScrDir] = useState<string>(localStorage.getItem('preferredDir') || '');
  const [timoutToDelScreenShot, settimoutToDelScreenShot] = useState<number>();

  // useEffect(() => {
  //   console.log('local storage', localStorage.getItem('preferredDir'));
  //   const prefferedDir = localStorage.getItem('preferredDir');
  //   if (prefferedDir) {
  //     invoke('hide_window').then(() => { console.log('closed') }).catch(e => { console.log('err', e) });
  //   }
  // }, [])


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
      <button
        onClick={async () => {
          const selectedDir = await openFolder()
          console.log('scrDir', selectedDir)
          setUserScrDir(selectedDir as string);
          localStorage.setItem('preferredDir', selectedDir as string)
        }}
      >
        select screeshot folder to monitor
      </button>
      <input
        type={'number'}
        onChange={(e) => {
          console.log('ee', e.target.value);

        }}
        defaultValue={10}
        placeholder="set time for deleting the screen shot in seconds"
      />
      <button>
        Smear
      </button>
    </div>
  );
}

export default App;
