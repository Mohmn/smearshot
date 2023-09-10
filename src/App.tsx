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
      startWatchingForFiles(scs,userScrDir);
      invoke('watch', { path: userScrDir }).catch(e => {
        console.error('Error watching path:', e);
        // Handle error...
      });

    }
    )()
  }, [userScrDir])


  return (
    <div className="app-container">
      <div className="subheader">Select folder and set lifespan for screenshots.</div>
      <div className="content">
        <div className="folder-selection">
          <div className="folder-status">
            Folder: {userScrDir || 'Not: set'}
          </div>
          <button
            className="folder-btn"
            onClick={async () => {
              const selectedDir = await openFolder()
              console.log('scrDir', selectedDir)
              if(!selectedDir) return;
              setUserScrDir(selectedDir as string);
              localStorage.setItem('preferredDir', selectedDir as string)
            }}>
            Select Screenshot Folder
          </button>
        </div>
        <div className="lifespan-selection">
          <div className="lifespan-status">
            Lifespan: {timoutToDelScreenShot || 'Not: set'}
          </div>
          <input
            type="text"
            className="lifespan-input"
            placeholder="Enter number"
            defaultValue={10}
            onChange={(e) => {
              console.log('ee', e.target.value);
            }
            } />
        </div>
        <button className="smear-btn">Smear</button>
      </div>
    </div>
  );
}

export default App;
