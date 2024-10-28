const orderStatus = {
  'apply_refund': {
    text: '申请售后',
    func: 'handleRefund'
  },
  'cancel': {
    text: '取消订单',
    func: 'handleCancel'
  },
  'pay': {
    text: '支付',
    func: 'handlePay'
  },
  'complete': {
    text: '完成',
    func: 'handleComplete'
  },
  'wait_pay': {
    text: '待支付',
    func: 'handleWaitPay'
  },
  'wait_send': {
    text: '待发货',
    func: 'handleWaitSend'
  },
  'wait_receive': {
    text: '确认收货',
    func: 'handleWaitReceive'
  },
  'complete_receive': {
    text: '已完成',
    func: 'handleCompleteReceive'
  },
  'refund': {
    text: '退款中',
    func: 'handleRefund'
  },
  'refund_complete': {
    text: '退款完成',
    func: 'handleRefundComplete'
  },
  'after_sales': {
    text: '申请售后',
    func: 'handleAfterSales'
  },
  delete_order: {
    text: '删除订单',
    func: 'handleDeleteOrder'
  },
  rebuy: {
    text: '再次购买',
    func: 'handleRebuy'
  },
  write_off: {
    text: '核销',
    func: 'handleWriteOff'
  }

}

export default orderStatus