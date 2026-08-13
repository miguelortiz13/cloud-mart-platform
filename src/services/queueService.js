const config = require('../config/env');

class QueueService {
  constructor() {
    this.messages = [];
    this.sbEvents = [];
  }

  async getHealthStatus() {
    return {
      connected: true,
      provider: 'Azure Service Bus',
      namespace: config.SERVICE_BUS.NAMESPACE,
      queueName: config.SERVICE_BUS.QUEUE_NAME,
      topicName: config.SERVICE_BUS.TOPIC_NAME,
      messagesInQueue: this.messages.length,
      publishedEvents: this.sbEvents.length
    };
  }

  async publishOrderEvent(order) {
    const sbPayload = {
      messageId: `sb-msg-${Math.random().toString(36).substring(2, 11)}`,
      namespace: config.SERVICE_BUS.NAMESPACE,
      topic: config.SERVICE_BUS.TOPIC_NAME,
      enqueuedTimeUtc: new Date().toISOString(),
      body: order,
      userProperties: {
        eventType: 'OrderCreated',
        source: 'AzureContainerApp.Api'
      }
    };
    
    this.sbEvents.push(sbPayload);

    // Simulate Azure Service Bus Topic forwarding to Queue
    const queueMessage = {
      messageId: sbPayload.messageId,
      deliveryCount: 1,
      body: sbPayload.body,
      sequenceNumber: this.messages.length + 100,
      enqueuedTimeUtc: sbPayload.enqueuedTimeUtc
    };

    this.messages.push(queueMessage);

    return {
      serviceBusMessageId: sbPayload.messageId,
      queueName: config.SERVICE_BUS.QUEUE_NAME,
      status: 'ENQUEUED_IN_SERVICE_BUS'
    };
  }

  async getRecentEvents() {
    return {
      serviceBusQueueMessages: this.messages.slice(-5),
      topicEvents: this.sbEvents.slice(-5)
    };
  }
}

module.exports = new QueueService();
