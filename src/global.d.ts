type TIMERUNIT = 'MINUTES' | 'SECONDS';

type TIMER = {
    time: number;
    unit: TIMERUNIT;
}

type Permission = {
	permission: boolean;
}