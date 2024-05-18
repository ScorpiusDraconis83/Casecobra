import { db } from "@/app/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import OrderReceivedEmail from "@/components/emails/order-recived-email";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return new Response("Invalid signature", { status: 400 });
    }
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      if (!event.data.object.customer_details?.email) {
        throw new Error("Missing user email");
      }
      const session = event.data.object as Stripe.Checkout.Session;

      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      };
      if (!userId || !orderId) {
        throw new Error("Invalid request metadata");
      }
      const billingAddress = session.customer_details!.address;
      const shippingAddress = session.shipping_details!.address;

      const updatedOrder = await db.order.update({
        where: {
          id: orderId,
          userId: userId,
        },
        data: {
          isPaid: true,
          shippingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: shippingAddress?.city!,
              country: shippingAddress?.country!,
              postalCode: shippingAddress?.postal_code!,
              street: shippingAddress?.line1!,
              state: shippingAddress?.state!,
            },
          },
          billingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: billingAddress?.city!,
              country: billingAddress?.country!,
              postalCode: billingAddress?.postal_code!,
              street: billingAddress?.line1!,
              state: billingAddress?.state!,
            },
          },
        },
      });
      resend.emails
        .send({
          from: "CaseCobra <onboarding@resend.dev>",
          to: [event.data.object.customer_details.email],
          subject: "Thanks for your order!",
          react: OrderReceivedEmail({
            orderId,
            orderDate: updatedOrder.createdAt.toLocaleDateString(),
            // @ts-ignore
            shippingAddress: {
              name: session.customer_details!.name!,
              city: shippingAddress?.city!,
              country: shippingAddress?.country!,
              postalCode: shippingAddress?.postal_code!,
              street: shippingAddress?.line1!,
              state: shippingAddress?.state!,
            },
          }),
        })
        .then(() => {
          console.log("Email sent successfully!");
        })
        .catch((error: Error) => {
          console.error("Failed to send email:", error);
        });
    }

    return NextResponse.json({ resul: event, ok: true });
  } catch (err) {
    console.log(err);
    // there is tool to track user erro called sentry
    return NextResponse.json(
      { message: "SomeThing went wrong", ok: false },
      { status: 500 }
    );
  }
}
/// there is tool to test webhooks called ngrok
