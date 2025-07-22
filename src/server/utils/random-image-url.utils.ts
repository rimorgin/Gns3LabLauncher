import { images as displayImage } from "@srvr/configs/constants.config.ts";

export const getRandomImageUrlImage = (
  imageType: "projects" | "courses" | "classrooms" | "userGroups",
  tag?: string,
): string => {
  let images;
  if (imageType === "projects") {
    images = tag
      ? displayImage.projectImages.filter((img) => img.tags === tag)
      : displayImage.projectImages;
    if (!images.length) images = displayImage.projectImages;
  } else if (imageType === "userGroups") {
    images = displayImage.userGroupImages;
  } else {
    images = displayImage.courseImages;
  }
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex].src;
};
