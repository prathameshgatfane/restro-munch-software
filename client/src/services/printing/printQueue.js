import { db } from '../offline/db';

export class PrintQueue {
  static async enqueue(type, htmlContent) {
    const job = {
      id: `print_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type, // 'KOT' | 'BILL'
      htmlContent,
      createdAt: new Date().toISOString(),
      printed: 0, // 0 = false, 1 = true
    };

    await db.transaction('rw', db.settings, async () => {
      const currentQueueItem = await db.settings.get('print_queue');
      const queue = currentQueueItem ? JSON.parse(currentQueueItem.value) : [];
      queue.push(job);
      await db.settings.put({ key: 'print_queue', value: JSON.stringify(queue) });
    });

    return job.id;
  }

  static async getQueue() {
    const item = await db.settings.get('print_queue');
    return item ? JSON.parse(item.value) : [];
  }

  static async clearQueue() {
    await db.settings.put({ key: 'print_queue', value: JSON.stringify([]) });
  }

  static async removeJob(jobId) {
    const queue = await this.getQueue();
    const updated = queue.filter((j) => j.id !== jobId);
    await db.settings.put({ key: 'print_queue', value: JSON.stringify(updated) });
  }
}
