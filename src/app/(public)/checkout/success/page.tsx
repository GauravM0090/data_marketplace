import { getOrderById } from '@/services/order.service'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const { orderId } = await searchParams
  const order = orderId ? await getOrderById(orderId) : null
  const isPaid = order?.status === 'paid'

  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold">
        {isPaid ? 'Payment confirmed' : 'Finishing up your payment…'}
      </h1>
      <p className="mt-4 text-white/70">
        {isPaid
          ? "You're all set — your dataset is ready to download."
          : "We're confirming your payment with Dodo. This can take a few seconds — refresh if it doesn't update."}
      </p>
    </main>
  )
}
