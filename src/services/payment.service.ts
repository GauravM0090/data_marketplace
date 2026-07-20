import { dodo } from '@/lib/dodo'
import { logger } from '@/lib/logger'

interface CreateDatasetProductParams {
  title: string
  price: number // major units, e.g. 149.99
  currency: string // 3-letter ISO, e.g. 'USD'
}

/**
 * Creates a one-time Dodo Product for a dataset and returns its product id.
 * Called when a seller/admin uploads a dataset, so the dataset is purchasable
 * straight away — the returned id is stored as `dataset.dodoProductId` and later
 * used to build the checkout cart.
 *
 * Dodo prices are in the smallest currency unit (cents), so the major-unit
 * `price` is converted here ($149.99 → 14999). `tax_category` is
 * `digital_products` (datasets are digital goods).
 */
export async function createDatasetProduct(
  params: CreateDatasetProductParams
): Promise<string> {
  const { title, price, currency } = params

  logger.info({ title }, 'payment.service: creating Dodo product for dataset')

  try {
    const product = await dodo.products.create({
      name: title,
      tax_category: 'digital_products',
      price: {
        type: 'one_time_price',
        currency: currency as Parameters<typeof dodo.products.create>[0]['price']['currency'],
        price: Math.round(price * 100),
        discount: 0,
        purchasing_power_parity: false,
      },
    })

    logger.info(
      { title, productId: product.product_id },
      'payment.service: Dodo product created'
    )

    return product.product_id
  } catch (error) {
    logger.error({ error, title }, 'payment.service: failed to create Dodo product')
    throw error
  }
}

interface CreateCheckoutSessionParams {
  orderId: string
  userId: string
  datasetId: string
  dodoProductId: string
  returnUrl: string
  cancelUrl: string
}

/**
 * Creates a Dodo-hosted checkout session for a single dataset purchase.
 * `metadata.orderId` is how the webhook (payment.service has no part in
 * receiving webhooks — see order.service + the webhook route) finds its way
 * back to our `orders` row once Dodo confirms the payment.
 *
 * Discounts are entered by the buyer directly on Dodo's checkout page
 * (`discount_codes`, enabled by default via `feature_flags.allow_discount_code`)
 * — Dodo validates the code and computes the final charged total itself, so
 * there's no app-side discount math to keep in sync.
 */
export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
  const { orderId, userId, datasetId, dodoProductId, returnUrl, cancelUrl } = params

  logger.info({ orderId, datasetId }, 'payment.service: creating Dodo checkout session')

  try {
    const session = await dodo.checkoutSessions.create({
      product_cart: [{ product_id: dodoProductId, quantity: 1 }],
      metadata: { orderId, userId, datasetId },
      return_url: returnUrl,
      cancel_url: cancelUrl,
      allowed_payment_method_types: [
        'upi_collect',
        'upi_intent',
        'credit',
        'debit',
        'klarna',
        'afterpay_clearpay',
        'billie',
        'sunbit',
      ],
    })

    logger.info(
      { orderId, sessionId: session.session_id },
      'payment.service: checkout session created'
    )

    return session
  } catch (error) {
    logger.error({ error, orderId, datasetId }, 'payment.service: failed to create checkout session')
    throw error
  }   
}
