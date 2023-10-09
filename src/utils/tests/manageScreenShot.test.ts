import { describe, it, expect } from 'vitest';
import { TaskQueuePC } from '../TaskQueuePC';
import { manageScreenShots } from '../index';

describe('manageScreenShots', () => {

	// File is created and added to the set
	it('should add file to set when created', () => {
		const taskQ = new TaskQueuePC(1);
		const fileNameOrganiser = new Set<string>();
		const event = {
			paths: ['file1.txt'],
			type: { create: { kind: 'file' } }
		};
		manageScreenShots(taskQ, fileNameOrganiser, event, 1000);
		expect(fileNameOrganiser.has('file1.txt')).toBe(true);
	});


	// File is already in the set and is not added again
	it('should not add file to set if it already exists', () => {
		const taskQ = new TaskQueuePC(1);
		const fileNameOrganiser = new Set<string>();
		fileNameOrganiser.add('file1.txt');
		const event = {
			paths: ['file1.txt'],
			type: { create: { kind: 'file' } }
		};
		manageScreenShots(taskQ, fileNameOrganiser, event, 1000);
		expect(fileNameOrganiser.size).toBe(1);
	});

	// Event type is not 'create' and function returns without doing anything
	it('should return without doing anything if event type is not "create"', () => {
		const taskQ = new TaskQueuePC(1);
		const fileNameOrganiser = new Set<string>();
		const event = {
			paths: ['file1.txt'],
			type: { delete: { kind: 'file' } }
		};
		manageScreenShots(taskQ, fileNameOrganiser, event, 1000);
		expect(fileNameOrganiser.size).toBe(0);
	});
});
