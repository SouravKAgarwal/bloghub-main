import { toast } from "sonner";
import { app } from "./firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

 export const API_URI = "https://bloghubmern.onrender.com";
//export const API_URI = "http://localhost:8800";

export function getInitials(fullName) {
  const names = fullName.split(" ");
  const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());

  const initialStr = initials.join("");

  return initialStr;
}

export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export const saveUserInfo = (user, signIn) => {
  localStorage.setItem(
    "userInfo",
    JSON.stringify({ user: user?.user, token: user?.token })
  );
  signIn({ user: user?.user, token: user?.token });

  setTimeout(() => {
    window.history.back();
  }, 1500);
};

export const uploadFile = (setFileUrl, setProgress, file) => {
  const storage = getStorage(app);

  const name = new Date().getTime() + file.name;
  const storageRef = ref(storage, name);

  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress(progress);
    },
    (error) => {
      console.log(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
        setFileUrl(downloadUrl);
        setProgress(null);
      });
    }
  );
};

export const updateUrl = ({ page, navigate, location, cat }) => {
  const params = new URLSearchParams();

  if (page && page > 1) {
    params.set("page", page);
  }

  if (cat) {
    params.set("cat", cat);
  }

  const newURL = `${location.pathname}?${params.toString()}`;
  navigate(newURL, { replace: true });

  return newURL;
};
