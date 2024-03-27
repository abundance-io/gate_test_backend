import { Router, Request, Response, NextFunction } from "express";
import { Tspec } from "tspec";
import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/auth.middleware";
import "express-async-errors";
import { ApiError } from "../types/errors";
import { cloudinary, upload } from "../utils/storage";
import { ImageId } from "../types/api";

const router = Router();
const prisma = new PrismaClient();

const sendMail = async (req: Request, res: Response) => {
  const email: string = res.locals.email;
  res.send(email);
};

const uploadPhotos = async (req: Request, res: Response) => {
  const email: string = res.locals.email;

  if (req.files) {
    const files = req.files as Express.Multer.File[];
    files.forEach((file) => {
      console.log(file.filename);
    });
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
      console.log("uploadingg");
      const uploadResponse = await cloudinary.uploader.upload(dataUri);
      console.log("upload complete");
      await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          profile_picture: dataUri,
        },
      });

      res.json({ publicId: uploadResponse.public_id });
    } catch (err) {
      throw err;
    }
  } else {
    throw new ApiError("no file attached", 400);
  }
};

export type UserApiSpec = Tspec.DefineApiSpec<{
  security: "jwt";
  paths: {
    "/user/sendmail": {
      post: {
        summary: "send mail to user";
        // handler: ;
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
          files: Tspec.BinaryString[];
        };

        responses: { 200: ImageId };
      };
    };
  };
}>;

router.post("/sendmail", verifyToken, sendMail);
router.post(
  "/uploadprofile",
  verifyToken,
  upload.single("file"),
  uploadProfile
);

router.post("/uploadphotos", verifyToken, upload.array("file"), uploadPhotos);

export default router;
