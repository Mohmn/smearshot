import { useLayoutEffect, useState } from "react";
import { fileWatcher, convertTimeToMiliSeconds } from "./utils";
import { invoke } from "@tauri-apps/api/tauri";
import { enable } from "tauri-plugin-autostart-api";
import Lifespan from "./Components/Lifespan";
import SelectFolder from "./Components/SelecFolder";
import TimeoutMsg from "./Components/TimeoutMsg";
import { LOCALSTORAGEKEYS } from "./constant";
import { UnlistenFn } from "@tauri-apps/api/event";
import "./App.css";


let startListeningForScreenShot: (pathToWatch: string, screenshotLife: number) => Promise<UnlistenFn>;

(async () => {
	startListeningForScreenShot = await fileWatcher();
})();

function App() {

	const [userScrDir, setUserScrDir] = useState<string>(() => localStorage.getItem(LOCALSTORAGEKEYS.SCRDIR) || '');
	const [timerToDelScreenShot, setTimerToDelScreenShot] = useState<TIMER>(() => {
		const defaultTimerObj: TIMER = {
			time: 1,
			unit: 'MINUTES'
		};
		const storedTimerObj = localStorage.getItem(LOCALSTORAGEKEYS.LIFESPANOFSCR);
		const timerObj = storedTimerObj ? JSON.parse(storedTimerObj) as TIMER : defaultTimerObj;
		return timerObj;
	});
	const [showMsg, setShowMsg] = useState<boolean>(false);

	// to start the app automaticall on startup
	useLayoutEffect(() => {
		(async () => {
			await enable()
		})()
	}, [])

	useLayoutEffect(() => {
		console.log('local storage', localStorage.getItem(LOCALSTORAGEKEYS.SCRDIR));
		const prefferedDir = localStorage.getItem(LOCALSTORAGEKEYS.SCRDIR);
		if (prefferedDir) {
			invoke('hide_window').then(() => { console.log('closed') }).catch(e => { console.log('err', e) });
		}
	}, [])


	// listenForwindowCLoseandWindowOpen 
	// on window(i.e when laptop shuts down) close if there any remaining items in set
	// store them in disk
	// on window open if there is anything in the disk load it into set
	// and create timers for them
	// tried it but window on_created (TauriEvent.WINDOW_CREATED) isnt firing


	// async function respondToUserChnages() {

	// }

	const userHasntSelectedAything = !(!!userScrDir);
	return (
		<div className="app-container">
			{
				userHasntSelectedAything &&
				<h4 className="header">
					Select screenshot folder and set lifespan for screenshots.
				</h4>
			}
			<SelectFolder
				userScreenShotDirectory={userScrDir}
				setUserScreenShotDirectoiry={setUserScrDir}
			/>
			<Lifespan
				timerToDelScreenShot={timerToDelScreenShot}
				setTimerToDelScreenShot={setTimerToDelScreenShot}
			/>
			<button
				className="smear-btn"
				onClick={async () => {
					if (!userScrDir || !timerToDelScreenShot) return;
					await startListeningForScreenShot(
						userScrDir,
						convertTimeToMiliSeconds(timerToDelScreenShot.time, timerToDelScreenShot.unit)
					)
					setShowMsg(true);
				}}
			>
				Smear
			</button>
			{showMsg &&
				<TimeoutMsg
					timer={5000}
					onTimeOut={() => setShowMsg(false)}
				>
					<p className="success-msg">
						Smearing initiated! Your screenshots are now set to be deleted after the specified lifespan.
						Check the deletion confirmation dialog after capturing each screenshot.
						Happy Smearing
					</p>
				</TimeoutMsg>
			}
		</div>
	);
}

export default App;
