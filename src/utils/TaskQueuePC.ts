// https://github.com/PacktPublishing/Node.js-Design-Patterns-Third-Edition

type ConsumerFunction = (args: any) => void;
type TaskFunction = () => Promise<any>;

export class TaskQueuePC {
	private taskQueue: TaskFunction[];
	private consumerQueue: ConsumerFunction[];

	constructor(concurrency: number) {
		this.taskQueue = [];
		this.consumerQueue = [];

		// spawn consumers
		for (let i = 0; i < concurrency; i++) {
			this.consumer();
		}
	}

	private async consumer() {
		while (true) {
			try {
				const task = await this.getNextTask();
				await task();
			} catch (err) {
				console.error(err);
			}
		}
	}

	private getNextTask(): Promise<any> {
		return new Promise((resolve) => {
			if (this.taskQueue.length !== 0) {
				return resolve(this.taskQueue.shift());
			}

			this.consumerQueue.push(resolve);
		})
	}

	runTask(task: TaskFunction) {
		return new Promise((resolve, reject) => {
			const taskWrapper = () => {
				const taskPromise = task();
				taskPromise.then(resolve, reject);
				return taskPromise;
			}

			if (this.consumerQueue.length !== 0) {
				// there is a sleeping consumer available, use it to run our task
				const consumer = this.consumerQueue.shift() as ConsumerFunction;
				consumer(taskWrapper);
			} else {
				// all consumers are busy, enqueue the task
				this.taskQueue.push(taskWrapper);
			}
		})
	}
}
