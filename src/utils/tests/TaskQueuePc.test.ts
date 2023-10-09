import { TaskQueuePC } from '../TaskQueuePC';
import { describe, it, vi, expect } from 'vitest';

describe('TaskQueuePC', () => {
	it('should run tasks two concurrently', async () => {
		const taskQueue = new TaskQueuePC(2); // concurrency of 2

		const mockTask1 = vi.fn(() => new Promise(res => setTimeout(res, 100)));
		const mockTask2 = vi.fn(() => new Promise(res => setTimeout(res, 100)));
		const mockTask3 = vi.fn(() => new Promise(res => setTimeout(res, 100)));

		const startTime = Date.now();

		await Promise.all([
			taskQueue.runTask(mockTask1),
			taskQueue.runTask(mockTask2),
			taskQueue.runTask(mockTask3)
		]);

		const endTime = Date.now();
		const duration = endTime - startTime;

		expect(mockTask1).toHaveBeenCalled();
		expect(mockTask2).toHaveBeenCalled();
		expect(mockTask3).toHaveBeenCalled();
		expect(duration).toBeGreaterThanOrEqual(200);
	});

	it('should run tasks three concurrently', async () => {
		const taskQueue = new TaskQueuePC(3); // concurrency of 2

		const mockTask1 = vi.fn(() => new Promise(res => setTimeout(res, 100)));
		const mockTask2 = vi.fn(() => new Promise(res => setTimeout(res, 100)));
		const mockTask3 = vi.fn(() => new Promise(res => setTimeout(res, 100)));

		const startTime = Date.now();

		await Promise.all([
			taskQueue.runTask(mockTask1),
			taskQueue.runTask(mockTask2),
			taskQueue.runTask(mockTask3)
		]);

		const endTime = Date.now();
		const duration = endTime - startTime;

		expect(mockTask1).toHaveBeenCalled();
		expect(mockTask2).toHaveBeenCalled();
		expect(mockTask3).toHaveBeenCalled();
		expect(duration).toBeLessThanOrEqual(110);
	});

	it('should handle task errors without stopping consumers', async () => {
		const taskQueue = new TaskQueuePC(1);

		const mockTask1 = vi.fn(() => Promise.reject(new Error('Task 1 Error')));
		const mockTask2 = vi.fn(() => Promise.resolve('Task 2 Success'));

		let error: Error;
		taskQueue.runTask(mockTask1).then().catch(e => {
			error = e as Error;
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Task 1 Error');
		});
		const result = await taskQueue.runTask(mockTask2);

		expect(mockTask1).toHaveBeenCalled();
		expect(mockTask2).toHaveBeenCalled();
		expect(result).toBe('Task 2 Success');
	});


	describe('TaskQueuePC', () => {
		it('should run only one task at a time with a concurrency of 1', async () => {
			const taskQueue = new TaskQueuePC(1);
	
			let task1Started = false;
			let task1Completed = false;
			let task2Started = false;
	
			const mockTask1 = vi.fn(async () => {
				task1Started = true;
				await new Promise(res => setTimeout(res, 100));
				task1Completed = true;
			});
	
			const mockTask2 = vi.fn(() => {
				task2Started = true;
				return Promise.resolve();
			});
	
			const task1Promise = taskQueue.runTask(mockTask1);
			const task2Promise = taskQueue.runTask(mockTask2);
	
			// Give a short delay to allow the event loop to process
			await new Promise(res => setTimeout(res, 50));
	
			// At this point, mockTask1 should have started, but not completed.
			expect(task1Started).toBe(true);
			expect(task1Completed).toBe(false);
	
			// mockTask2 should not have started because mockTask1 is still running.
			expect(task2Started).toBe(false);
	
			// Wait for both tasks to complete
			await Promise.all([task1Promise, task2Promise]);
	
			// Now, mockTask1 should be completed and mockTask2 should have started.
			expect(task1Completed).toBe(true);
			expect(task2Started).toBe(true);
		});
	});

	describe('TaskQueuePC', () => {
		it('should run only one task at a time with a concurrency of 2', async () => {
			const taskQueue = new TaskQueuePC(2);
	
			let task1Started = false;
			let task1Completed = false;
			let task2Started = false;
	
			const mockTask1 = vi.fn(async () => {
				task1Started = true;
				await new Promise(res => setTimeout(res, 100));
				task1Completed = true;
			});
	
			const mockTask2 = vi.fn(() => {
				task2Started = true;
				return Promise.resolve();
			});
	
			const task1Promise = taskQueue.runTask(mockTask1);
			const task2Promise = taskQueue.runTask(mockTask2);
	
			// Give a short delay to allow the event loop to process
			await new Promise(res => setTimeout(res, 50));
	
			// At this point, mockTask1 should have started, but not completed.
			expect(task1Started).toBe(true);
			expect(task1Completed).toBe(false);
	
			// mockTask2 should not have started because mockTask1 is still running.
			expect(task2Started).toBe(true);
	
			// Wait for both tasks to complete
			await Promise.all([task1Promise, task2Promise]);
	
			// Now, mockTask1 should be completed and mockTask2 should have started.
			expect(task1Completed).toBe(true);
			expect(task2Started).toBe(true);
		});
	});
});

