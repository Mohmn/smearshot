import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react'; 4
import 'vitest-dom/extend-expect';
import TimeoutMsg from '../TimeoutMsg';


beforeEach(() => {
	vi.useFakeTimers();
});

describe('TimeoutMsg', () => {

	it('should render children when timer is not expired', () => {
		render(
			<TimeoutMsg timer={5000}>
				<div>Test</div>
			</TimeoutMsg>
		);

		expect(screen.getByText('Test')).toBeInTheDocument();
	});

	it('should call onTimeOut function when timer expires', () => {
		const timer = 5000;
		const onTimeOut = vi.fn();
		render(
			<TimeoutMsg timer={5000} onTimeOut={onTimeOut}>
				<div>Test</div>
			</TimeoutMsg>
		);

		vi.advanceTimersByTime(timer);
		expect(onTimeOut).toHaveBeenCalled();
	});

	it('should clear timeout when component unmounts', () => {
		const timer = 5000;
		const onTimeOut = vi.fn();
		const { unmount } = render(
			<TimeoutMsg timer={timer} onTimeOut={onTimeOut}>
				<div>Test</div>
			</TimeoutMsg>
		);

		unmount();
		vi.advanceTimersByTime(timer);
		expect(onTimeOut).not.toHaveBeenCalled();
	});

	it('should not render children when timer is expired', async () => {
		const timer = 50;
		const onTimeOut = vi.fn();
		render(
			<TimeoutMsg timer={timer} onTimeOut={onTimeOut}>
				<div>Test</div>
			</TimeoutMsg>
		);
			
		act(() => {
			vi.advanceTimersByTime(timer);
		})
		expect(screen.queryByText('Test')).not.toBeInTheDocument();
	});

	it('should not call onTimeOut function when timer is not expired', () => {
		vi.useFakeTimers();
		const timer = 5000;
		const onTimeOut = vi.fn();
		render(
			<TimeoutMsg timer={timer} onTimeOut={onTimeOut}>
				<div>Test</div>
			</TimeoutMsg>
		);

		vi.advanceTimersByTime(timer - 1000);
		expect(onTimeOut).not.toHaveBeenCalled();
	});
});
