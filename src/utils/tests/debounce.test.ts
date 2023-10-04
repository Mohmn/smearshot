import { debounce } from "..";
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('debounce function', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	it('should delay the execution of the passed function', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, 1000); // 1 second delay

		debounced();
		expect(callback).not.toBeCalled();

		vi.advanceTimersByTime(500); // Half the delay time
		expect(callback).not.toBeCalled();

		vi.advanceTimersByTime(500); // Complete the delay time
		expect(callback).toBeCalled();
	});

	it('should execute the passed function only once if debounced function is called multiple times quickly', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, 1000); // 1 second delay

		debounced();
		debounced();
		debounced();

		vi.advanceTimersByTime(1000);
		expect(callback).toBeCalledTimes(1);
	});
});