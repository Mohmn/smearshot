import { useMemo, useState } from 'react';
import { LOCALSTORAGEKEYS } from '../../constant';
import { debounce } from '../../utils';
import './styles.css'


type Props = {
	timerToDelScreenShot: TIMER;
	setTimerToDelScreenShot: React.Dispatch<React.SetStateAction<TIMER>>,
}
export default function Lifespan(props: Props) {

	const { timerToDelScreenShot, setTimerToDelScreenShot } = props;
	const [error, setError] = useState<string>('');
	const timeDebouncer = useMemo(() => debounce((time: Partial<TIMER>) => {
		setTimerToDelScreenShot(timer => {
			const newTimerObj = {
				...timer,
				...time
			};
			localStorage.setItem(LOCALSTORAGEKEYS.LIFESPANOFSCR, JSON.stringify(newTimerObj));
			return newTimerObj;
		});
	}, 150), []);
	return (
		<div className="lifespan">
			<div>
				<div className="lifespan-status">
					Lifespan
				</div>
				<input
					type="text"
					className="lifespan-input"
					placeholder="Enter number"
					defaultValue={timerToDelScreenShot.time}
					onChange={(e) => {
						const time = +e.target.value;
						if (isNaN(time))
							setError('lifespan should be of type number');
						else {
							setError('');
							if (time !== timerToDelScreenShot.time)
								timeDebouncer({ 'time': time })
						}
					}}
				/>
				{
					error &&
					<span className='error-msg'>{error}</span>
				}
			</div>
			<div>
				<div className="lifespan-status">
					Unit
				</div>
				<select
					defaultValue={timerToDelScreenShot.unit}
					onChange={e => {
						const unit = e.target.value as TIMERUNIT;
						if (unit !== timerToDelScreenShot.unit)
							timeDebouncer({ 'unit': unit })
					}}
				>
					<option value={'MINUTES'}>minutes</option>
					<option value={'SECONDS'}>seconds</option>
				</select>
			</div>
		</div>
	)
}