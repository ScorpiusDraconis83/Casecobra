"use server";

import { OrderStatus } from "@prisma/client";
import { string } from "zod";
import { db } from "../db";

export const changeOrderStatus = async ({
  id,
  newStatus,
}: {
  id: string;
  newStatus: OrderStatus;
}) => {
  await db.order.update({
    where: {
      id,
    },
    data: {
      status: newStatus,
    },
  });
};
