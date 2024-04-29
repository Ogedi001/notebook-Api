import { RoleName } from "@prisma/client";
import { sendEmailVerificationLinkEmail } from "../helpers";
import { createRole, createUser } from "../service/auth-user-service";
import logger from "../Logger";

const adminCreate = async () => {
  const role = await createRole(RoleName.ADMIN);
  const adminDetails = {
    firstname: "admin",
    lastname: "admin",
    email: "admin@gmail.com",
    password: "123456",
  };
  const data = await createUser(adminDetails, role);

  await sendEmailVerificationLinkEmail({
    userId: data.id,
    email: data.email,
    username: `${adminDetails.firstname} ${adminDetails.lastname}`,
  });
  logger.info({message:"success"})
};

adminCreate();
