import axios from "axios";

export const uploadImage = async (imgFile) => {
  try {
    // create new form
    const formData = new FormData();
    // append imgFile into formData
    formData.append("image", imgFile);
    // host the image
    const { data } = await axios.post(
      "https://api.imgbb.com/1/upload?key=cc51b77e58af1426c3492c9240b3764b",
      formData
    );

    return data?.data?.url;
  } catch (error) {
    console.error(error);
  }
};
