import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

/**
 * An existing paid order for this user+dataset, if any — used to block
 * re-purchasing a dataset the user already owns.
 */
export async function findPaidOrder(userId: string, datasetId: string) {
  return prisma.order.findFirst({ where: { userId, datasetId, status: 'paid' } })
}

export async function createPendingOrder(params: {
  userId: string
  datasetId: string
  amount: Prisma.Decimal
  currency: string
}) {
  const { userId, datasetId, amount, currency } = params

  logger.info({ userId, datasetId }, 'order.service: creating pending order')

  return prisma.order.create({
    data: { userId, datasetId, amount, currency, status: 'pending' },
  })
}

export async function attachCheckoutSession(orderId: string, dodoSessionId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { dodoSessionId },
  })
}

export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({ where: { id: orderId } })
}

/**
 * Transitions a pending order to paid. Guarded by `status: 'pending'` in the
 * update filter so a duplicate webhook delivery for the same payment (Dodo
 * retries on any non-2xx response) is a safe no-op instead of double-applying
 * side effects.
 */
export async function markOrderPaid(params: { orderId: string; dodoPaymentId: string }) {
  const { orderId, dodoPaymentId } = params

  const result = await prisma.order.updateMany({
    where: { id: orderId, status: 'pending' },
    data: { status: 'paid', dodoPaymentId, paidAt: new Date() },
  })

  if (result.count === 0) {
    logger.info({ orderId }, 'order.service: markOrderPaid no-op — already processed or unknown order')
    return
  }

  logger.info({ orderId, dodoPaymentId }, 'order.service: order marked paid')
}

/** Same idempotency guard as {@link markOrderPaid}, for the failure path. */
export async function markOrderFailed(params: { orderId: string }) {
  const { orderId } = params

  const result = await prisma.order.updateMany({
    where: { id: orderId, status: 'pending' },
    data: { status: 'failed' },
  })

  if (result.count === 0) {
    logger.info({ orderId }, 'order.service: markOrderFailed no-op — already processed or unknown order')
    return
  }

  logger.info({ orderId }, 'order.service: order marked failed')
}
