import { ReactElement, useEffect, useState } from "react";


type Props = {
	timer: number;
	children: ReactElement
	onTimeOut?: () => void;
}
export default function Timeout(props: Props) {

	const { timer, children, onTimeOut } = props;
	const [timerExpired, setTimerExpired] = useState<boolean>(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setTimerExpired(true);
			onTimeOut && onTimeOut();
		}, timer);
		return () => clearTimeout(timeout);
	}, [timer, onTimeOut]);


	if (!timerExpired)
		return children;
	return null;

}