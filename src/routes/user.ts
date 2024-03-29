import { Router, Request, Response, NextFunction } from "express";
import { Tspec } from "tspec";
import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/auth.middleware";
import "express-async-errors";
import { ApiError } from "../types/errors";
import { cloudinary, upload } from "../utils/storage";
import { ImageId, ImageIds, Mail, UserData } from "../types/api";
import { WrapBody } from "../types/utils";
import { sendMail } from "../utils/mail";
import { Message } from "../types/api";
import { getUserDataFields } from "../utils/api";
import { validateData } from "../utils/schema";
import { sendMailSchema } from "../schemas/user";

const router = Router();
const prisma = new PrismaClient();

const uploadPhotos = async (req: Request, res: Response<ImageIds>) => {
  const email: string = res.locals.email;

  if (req.files) {
    const files = req.files as Express.Multer.File[];
    const uploadIds = await Promise.all(
      files.map(async (file) => {
        try {
          const base64EncodedImage = Buffer.from(file.buffer).toString(
            "base64"
          );
          const dataUri = `data:${file.mimetype};base64,${base64EncodedImage}`;
          const uploadResponse = await cloudinary.uploader.upload(dataUri);
          return uploadResponse.public_id;
        } catch (err) {
          throw err;
        }
      })
    );
    const prevPhotos = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        photos: true,
      },
    });

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        photos: prevPhotos ? prevPhotos.photos.concat(uploadIds) : uploadIds,
      },
    });
    res.json({ publicIds: uploadIds });
  } else {
  }
};

const uploadProfile = async (req: Request, res: Response<ImageId>) => {
  const email: string = res.locals.email;
  if (req.file) {
    console.log(req.file);
    try {
      const base64EncodedImage = Buffer.from(req.file.buffer).toString(
        "base64"
      );
      const dataUri = `data:${req.file.mimetype};base64,${base64EncodedImage}`;
      const uploadResponse = await cloudinary.uploader.upload(dataUri);
      await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          profile_picture: uploadResponse.public_id,
        },
      });

      res.json({ publicId: uploadResponse.public_id });
    } catch (err) {
      throw err;
    }
  } else {
    throw new ApiError("file invalid", 400);
  }
};

const sendUserMail = async (req: WrapBody<Mail>, res: Response<Message>) => {
  const email = res.locals.email;
  await sendMail(req.body);
  res.json({ message: "email sent" });
};

const getUser = async (req: Request, res: Response<UserData>) => {
  const email = res.locals.email;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user) {
    res.json(getUserDataFields(user));
  } else {
    throw new ApiError("User not found", 404);
  }
};

export type UserApiSpec = Tspec.DefineApiSpec<{
  security: "jwt";
  paths: {
    "/user": {
      get: {
        summary: "get user details";
        handler: typeof getUser;
      };
    };
    "/user/sendmail": {
      post: {
        summary: "send mail to user";
        handler: typeof sendUserMail;
      };
    };

    "/user/uploadprofile": {
      post: {
        summary: "upload user profile picture";
        /** @mediaType multipart/form-data */
        body: {
          file: Tspec.BinaryString;
        };

        responses: { 200: ImageId };
      };
    };

    "/user/uploadphotos": {
      post: {
        summary: "upload user photos";
        /** @mediaType multipart/form-data */
        body: {
          file: Tspec.BinaryString;
        };

        responses: { 200: ImageId };
      };
    };
  };
}>;

router.get("/", verifyToken, getUser);
router.post(
  "/sendmail",
  validateData(sendMailSchema),
  verifyToken,
  sendUserMail
);
router.post(
  "/uploadprofile",
  verifyToken,
  upload.single("file"),
  uploadProfile
);

router.post("/uploadphotos", verifyToken, upload.array("file"), uploadPhotos);

export default router;
