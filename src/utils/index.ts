import { watchImmediate } from "tauri-plugin-fs-watch-api"
import { confirm, open } from '@tauri-apps/api/dialog';
import { removeFile } from "@tauri-apps/api/fs";
import { TaskQueuePC } from "./TaskQueuePC";
import { UnlistenFn } from "@tauri-apps/api/event";

async function manageScreenShots(taskQ: TaskQueuePC, fileNameOrganiser: Set<string>, event: any, timeOut: number) {

	const fileName = event.paths[0]
	// file create event gets triggerd multiple times thats why im storing it in a set like this
	// to remove this hack i guess i would have to write rust myself 
	// and implement fs-watch-api myself
	if (fileNameOrganiser.has(fileName)) {
		console.log('user already has file', fileName)
		return
	}


	// type: {create: {kind: "file"}}}

	const userAddedFile = event?.type?.create;
	if (!userAddedFile) return;

	if (userAddedFile) {
		fileNameOrganiser.add(fileName)
		console.log(' saving it to set', event);
	}


	// await bringToFrontAndShowDialog();
	// const window = getCurrent();
	// await window.center();
	// await window.setFocus();
	// try{
	//     console.log('center')
	// await webview.setFocus()
	// }catch(e) {
	//     console.log('error while centering',e)
	// }
	// 

	// await webview.

	// pop  up only window at a time
	// if multiple screen shots are taken  
	taskQ.runTask(() => confirm("Are you sure to delete the screen shot", {
		title: 'smearshot'
	})
		.then(perm => {
			// return
			if (!perm) {
				console.log('user does not want to delt file so deleting it from set', fileName);
				fileNameOrganiser.delete(fileName)
				return
			}
			setTimeout(async () => {
				console.log('user gave perm to delt file so deleting it from dir and set', fileName);
				fileNameOrganiser.delete(fileName)
				await removeFile(fileName);
			}, timeOut)
		}).catch(err => {
			console.log('eror while opening dialog', err)
		})
	)


}

async function fileWatcher() {
	const taskQueue = new TaskQueuePC(1);
	const scs = new Set<string>();
	let watcher: UnlistenFn;
	let previousArgs: [string, number];
	return async function (pathToWatch: string, screenshotLife: number) {
		
		if (arraysAreEqual(previousArgs, [pathToWatch, screenshotLife])) return watcher;
		previousArgs = [pathToWatch, screenshotLife];
		watcher && watcher();
		watcher = await watchImmediate(pathToWatch, (event) => manageScreenShots(taskQueue, scs, event, screenshotLife));
		return watcher;
	}
}


// class FileWatcher {

// 	private screenShotFolder: string;
// 	private timer: number;
// 	constructor(path: string, timeOut: number) {
// 		this.screenShotFolder = path;
// 		this.timer = timeOut;
// 	}

// 	watch() {

// 	}

// 	modifyWatcher() {

// 	}
// }

async function openFolder() {
	return await open({
		directory: true
	});
}

function convertTimeToMiliSeconds(time: number, unit: TIMERUNIT) {
	if (time <= 0) return 0;
	const timeInMiliseconds = time * 1000;
	if (unit === 'MINUTES') return timeInMiliseconds * 60;
	return timeInMiliseconds;
}

function debounce<T extends (...args: any[]) => any>(func: T, timeout: number = 50) {
	let debouncedFunc: NodeJS.Timeout;

	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		debouncedFunc && clearTimeout(debouncedFunc);
		debouncedFunc = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
}

function arraysAreEqual(arr1: any[], arr2: any[]) {
	if(!arr1 || !arr2) return false;
	if (arr1.length !== arr2.length) return false;
	for (let i = 0; i < arr1.length; i++)
		if (arr1[i] !== arr2[i]) return false;
	return true;
}

export {
	fileWatcher,
	openFolder,
	debounce,
	convertTimeToMiliSeconds,
	arraysAreEqual,
	manageScreenShots
}