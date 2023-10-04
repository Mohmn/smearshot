import { arraysAreEqual } from "..";
import { describe, it, expect } from 'vitest';

describe('array utility function', () => {
	it('arrays should be equal', () => {
		const eq = arraysAreEqual([1,2],[1,2]);
		expect(eq).toBeTruthy()
	});

	it('arrays shouldnt be equal', () => {
		const eq = arraysAreEqual([1,2],[1,5,3]);
		expect(eq).toBeFalsy()
	});

	it('arrays shouldnt be equal', () => {
		const eq = arraysAreEqual([1,2],[1,3]);
		expect(eq).toBeFalsy()
	});

});
