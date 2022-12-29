import FormData from "form-data";
import { setProfilePic, setDescription } from "./auth";
import { updatePostsPicture } from "./posts";
import { updateProfilePicture } from "./profile";
import API from "../api/api";

export const changeImage = async (binary, crop) => {
  try {
    const payload = new FormData();
    payload.append("crop", JSON.stringify(crop));
    payload.append("newImage", binary);

    const res = await API.patch(`user/settings/profilePicture`, payload, {
      headers: {
        accept: "application/json",
        "Accept-Language": "en-US,en;q=0.8",
        "Content-Type": `multipart/form-data; boundary=${payload._boundary}`,
      },
    });
    console.log(res);
    updatePostsPicture(res.response.path);
    updateProfilePicture(res.response.path);
    setProfilePic(res.response.path);
  } catch (e) {
    console.log(e);
  }
};

export const changeDescription = (description) => {
  API.patch(`user/settings/description`, { description })
    .then((res) => {
      if (res.code == 200) {
        setDescription(res.response.newDescription);
      }
    })
    .catch((e) => console.log(e));
};
