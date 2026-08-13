# Azure Service Bus Namespace
resource "azurerm_servicebus_namespace" "sb" {
  name                = "sb-${local.name_prefix}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "Standard"

  tags = local.common_tags
}

# Service Bus Queue for Order Processing
resource "azurerm_servicebus_queue" "order_queue" {
  name         = "order-processing-queue"
  namespace_id = azurerm_servicebus_namespace.sb.id

  enable_partitioning                   = true
  max_delivery_count                    = 5
  dead_lettering_on_message_expiration = true
}

# Service Bus Topic for Order Events Fanout
resource "azurerm_servicebus_topic" "order_topic" {
  name         = "order-events-topic"
  namespace_id = azurerm_servicebus_namespace.sb.id
}

# Service Bus Subscription
resource "azurerm_servicebus_subscription" "order_sub" {
  name               = "order-processing-sub"
  topic_id           = azurerm_servicebus_topic.order_topic.id
  max_delivery_count = 5
  forward_to         = azurerm_servicebus_queue.order_queue.name
}
