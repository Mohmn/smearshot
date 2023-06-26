import { watchImmediate } from "tauri-plugin-fs-watch-api"
import { confirm, open, ask } from '@tauri-apps/api/dialog';
import { removeFile } from "@tauri-apps/api/fs";

async function startWatchingForFiles(fileNameOrganiser: Set<string>, pathToWatch: string) {
    return watchImmediate(pathToWatch,
        async (event: any) => {

            const fileName = event.paths[0]
            console.log('event', event);
            // file create event gets triggerd multiple times thats why im storing it in a set like this
            // to remove this hack i guess i would have to write rust myself 
            // and implement fs-watch-api myself
            if (fileNameOrganiser.has(fileName)) {
                console.log('user already has file', fileName)
                return
            }

            const userAddedFile = Object.hasOwn(event.type, 'create');
            if (!userAddedFile) return;

            if (userAddedFile) {
                fileNameOrganiser.add(fileName)
                console.log(' saving it to set', event);
            }

            confirm("Are you sure to delete the screen shot", {
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
                    }, 15000)
                }).catch(err => {
                    console.log('eror while opening dialog', err)
                });

        },
        // { recursive: true }
    )
}

async function openFolder() {
    return await open({
        directory: true
    });
}

export {
    startWatchingForFiles,
    openFolder
}