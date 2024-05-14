// "use server ";

// import { db } from "@/app/db";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// export const createCheckoutSession = async ({
//   configId,
// }: {
//   configId: string;
// }) => {
//   const configuration = await db.configuration.findUnique({
//     where: {
//       id: configId,
//     },
//   });
//   if (!configuration) {
//     throw new Error("No such configuration found");
//   }

//   const { getUser } = getKindeServerSession();
//   const user = await getUser();
//   if (!user) {
//     throw new Error("You need to be logged in");
//   }

//   const { finish, material } = configuration;
// };
