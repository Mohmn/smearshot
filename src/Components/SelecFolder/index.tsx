import { LOCALSTORAGEKEYS } from "../../constant";
import { openFolder } from "../../utils";
import './style.css'

type Props = {
	userScreenShotDirectory: string;
	setUserScreenShotDirectoiry: React.Dispatch<React.SetStateAction<string>>;
}
export default function SelectFolder(props: Props) {
	const { userScreenShotDirectory, setUserScreenShotDirectoiry } = props;
	return (
		<div className="folder-selection">
			<h3 >
				Selected Folder: {userScreenShotDirectory || 'Not: set'}
			</h3>
			<button
				className="folder-btn"
				onClick={async () => {
					const selectedDir = await openFolder()
					if (selectedDir === userScreenShotDirectory) return;
					localStorage.setItem(LOCALSTORAGEKEYS.SCRDIR, selectedDir as string);
					setUserScreenShotDirectoiry(selectedDir as string);
				}}>
				Select Screenshot Folder
			</button>
		</div>
	)
}