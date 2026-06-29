import { Webhooks } from '@dodopayments/nextjs'
import { markOrderPaid, markOrderFailed } from '@/services/order.service'
import { logger } from '@/lib/logger'

/**
 * POST /api/v1/webhooks/dodo
 *
 * Receives payment confirmation from Dodo Payments. `Webhooks` (the
 * @dodopayments/nextjs adapter) handles signature verification (401 on a bad
 * signature) and payload validation (400 on a malformed body) before
 * dispatching to the matching event handler below — only the order-update
 * logic lives here.
 *
 * Only updates the `orders` row (status, dodoPaymentId, paidAt). Granting
 * actual file access is a separate concern checked at download time against
 * `Order.status === 'paid'`, not created here — a Download record stamped
 * with `ipAddress`/`downloadedAt` at webhook time would record Dodo's server,
 * not the buyer's, and conflate "paid" with "downloaded".
 */
export const POST = Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY!,

  onPaymentSucceeded: async (payload) => {
    const orderId = payload.data.metadata?.orderId
    if (typeof orderId !== 'string'){
      logger.error(
        { paymentId: payload.data.payment_id },
        'webhook/dodo: payment.succeeded missing orderId in metadata'
      )
      return
    }

    await markOrderPaid({ orderId, dodoPaymentId: payload.data.payment_id })
  },

  onPaymentFailed: async (payload) => {
    const orderId = payload.data.metadata?.orderId
    if (typeof orderId !== 'string') {
      logger.error(
        { paymentId: payload.data.payment_id },
        'webhook/dodo: payment.failed missing orderId in metadata'
      )
      return
    }

    await markOrderFailed({ orderId })
  },
})
