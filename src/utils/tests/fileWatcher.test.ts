import { describe, it, expect, beforeAll } from 'vitest';
import { fileWatcher } from '..';

beforeAll(() => {
  Object.defineProperty(window, '__TAURI_IPC__', {
    value: function mock(...args: any[]) {
      
    },
  });
});

describe('fileWatcher', () => {

	// Returns a function
	it('should return a function', async () => {
		const watcher = await fileWatcher();
		expect(typeof watcher).toBe('function');
	});

	// Returns a function that returns a function
	it('should return a function that returns a function', async () => {

		const watcher = await fileWatcher();
		const innerFunction = watcher('path', 1000);
		expect(typeof innerFunction).toBe('object');
	});


	// Returns the same watcher if called with the same arguments
	it('should return the same watcher if called with the same arguments', async () => {
		const watcher = await fileWatcher();
		const watcher1 = watcher('path', 1000);
		const watcher2 = watcher('path', 1000);
		expect(watcher1).toStrictEqual(watcher2);
	});

	// Returns the same watcher if called with the same arguments
	it('should return different watchers if called with different arguments', async () => {
		const watcher = await fileWatcher();
		const watcher1 = watcher('path1', 1000);
		const watcher2 = watcher('path2', 2000);
		expect(watcher1).not.toBe(watcher2);
	});
});
