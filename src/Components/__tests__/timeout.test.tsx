import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react'; 4
import 'vitest-dom/extend-expect';
import Timeout from '../Timeout';


beforeEach(() => {
	vi.useFakeTimers();
});

describe('Timeout', () => {

	it('should render children when timer is not expired', () => {
		render(
			<Timeout timer={5000}>
				<div>Test</div>
			</Timeout>
		);

		expect(screen.getByText('Test')).toBeInTheDocument();
	});

	it('should call onTimeOut function when timer expires', () => {
		const timer = 5000;
		const onTimeOut = vi.fn();
		render(
			<Timeout timer={5000} onTimeOut={onTimeOut}>
				<div>Test</div>
			</Timeout>
		);

		vi.advanceTimersByTime(timer);
		expect(onTimeOut).toHaveBeenCalled();
	});

	it('should clear timeout when component unmounts', () => {
		const timer = 5000;
		const onTimeOut = vi.fn();
		const { unmount } = render(
			<Timeout timer={timer} onTimeOut={onTimeOut}>
				<div>Test</div>
			</Timeout>
		);

		unmount();
		vi.advanceTimersByTime(timer);
		expect(onTimeOut).not.toHaveBeenCalled();
	});

	it('should not render children when timer is expired', async () => {
		const timer = 50;
		const onTimeOut = vi.fn();
		render(
			<Timeout timer={timer} onTimeOut={onTimeOut}>
				<div>Test</div>
			</Timeout>
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
			<Timeout timer={timer} onTimeOut={onTimeOut}>
				<div>Test</div>
			</Timeout>
		);

		vi.advanceTimersByTime(timer - 1000);
		expect(onTimeOut).not.toHaveBeenCalled();
	});
});
