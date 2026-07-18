import { db } from './db';
import apiClient from '../api/apiClient';

export class SyncQueue {
  static async enqueue(type, data) {
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const operation = {
      id,
      type, // 'create_order' | 'update_order' | 'settle_bill' | 'move_table'
      data,
      createdAt: new Date().toISOString(),
      retries: 0,
    };
    
    // Save to settings table in IndexedDB under sync_queue key
    await db.transaction('rw', db.settings, async () => {
      const currentQueueItem = await db.settings.get('sync_queue');
      const queue = currentQueueItem ? JSON.parse(currentQueueItem.value) : [];
      queue.push(operation);
      await db.settings.put({ key: 'sync_queue', value: JSON.stringify(queue) });
    });

    return id;
  }

  static async getQueue() {
    const item = await db.settings.get('sync_queue');
    return item ? JSON.parse(item.value) : [];
  }

  static async updateQueue(newQueue) {
    await db.settings.put({ key: 'sync_queue', value: JSON.stringify(newQueue) });
  }

  static async processQueue() {
    const queue = await this.getQueue();
    if (queue.length === 0) return;

    console.log(`SyncQueue: Processing ${queue.length} pending operations...`);
    const remaining = [];

    for (const op of queue) {
      try {
        await this.executeOperation(op);
        // Mark database entries as synced if applicable
        await this.updateLocalSyncState(op);
      } catch (error) {
        console.error(`SyncQueue: Failed to process ${op.type} (${op.id}). Error:`, error);
        op.retries += 1;
        if (op.retries < 5) {
          remaining.push(op); // retry later
        } else {
          console.error(`SyncQueue: Max retries exceeded for operation ${op.id}. Discarding.`);
          // Fire global notification or audit log for failure
        }
      }
    }

    await this.updateQueue(remaining);
  }

  static async executeOperation(op) {
    const { type, data } = op;
    switch (type) {
      case 'create_order':
        return await apiClient.post('/orders', data);
      case 'update_order':
        return await apiClient.put(`/orders/${data.id}`, data);
      case 'settle_bill':
        return await apiClient.post(`/orders/${data.orderId}/settle`, data);
      case 'move_table':
        return await apiClient.post(`/orders/${data.orderId}/move`, data);
      default:
        throw new Error(`Unknown sync operation type: ${type}`);
    }
  }

  static async updateLocalSyncState(op) {
    const { type, data } = op;
    if (type === 'create_order' || type === 'update_order') {
      const order = await db.orders.get(data.id);
      if (order) {
        order.synced = 1;
        await db.orders.put(order);
      }
    } else if (type === 'settle_bill') {
      const bill = await db.bills.get(data.id);
      if (bill) {
        bill.synced = 1;
        await db.bills.put(bill);
      }
    }
  }
}
