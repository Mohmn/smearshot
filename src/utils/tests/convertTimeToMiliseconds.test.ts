import { convertTimeToMiliSeconds } from "..";
import { describe, it, expect } from 'vitest';

describe('convertTimeToMiliSeconds', () => {

	// Converts time in seconds to milliseconds
	it('should convert time in seconds to milliseconds', () => {
		const result = convertTimeToMiliSeconds(10, 'SECONDS');
		expect(result).toBe(10000);
	});

	// Converts time in minutes to milliseconds
	it('should convert time in minutes to milliseconds', () => {
		const result = convertTimeToMiliSeconds(5, 'MINUTES');
		expect(result).toBe(300000);
	});

	// Returns correct value for input of 0 seconds/minutes
	it('should return correct value for input of 0 seconds/minutes', () => {
		const result1 = convertTimeToMiliSeconds(0, 'SECONDS');
		const result2 = convertTimeToMiliSeconds(0, 'MINUTES');
		expect(result1).toBe(0);
		expect(result2).toBe(0);
	});

	// Returns 0 for negative time input
	it('should return 0 for negative time input', () => {
		const result1 = convertTimeToMiliSeconds(-10, 'SECONDS');
		const result2 = convertTimeToMiliSeconds(-5, 'MINUTES');
		expect(result1).toBe(0);
		expect(result2).toBe(0);
	});
});
