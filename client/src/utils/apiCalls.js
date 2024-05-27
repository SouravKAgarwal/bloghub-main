import axios from "axios";
import { API_URI } from ".";

export const getGoogleSignUp = async (accessToken) => {
  try {
    const user = await axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data);

    if (user?.sub) {
      const data = {
        name: user.name,
        email: user.email,
        emailVerified: user.email_verified,
        image: user.picture,
      };

      const result = await axios.post(`${API_URI}/auth/google-signup`, data);

      return result.data;
    }
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const emailSignUp = async (data) => {
  try {
    const result = await axios.post(`${API_URI}/auth/register`, data);

    return result.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const getGoogleSignIn = async (accessToken) => {
  try {
    const user = await axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data);

    if (user?.sub) {
      const data = {
        email: user.email,
      };

      const result = await axios.post(`${API_URI}/auth/login`, data);

      return result.data;
    }
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const emailLogin = async (data) => {
  try {
    const result = await axios.post(`${API_URI}/auth/login`, data);

    return result.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const getSinglePost = async (id) => {
  try {
    const { data } = await axios.get(`${API_URI}/posts/${id}`);

    return data?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const getPostComment = async (id) => {
  try {
    const { data } = await axios.get(`${API_URI}/posts/comments/${id}`);
    return data?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const postComment = async (id, token, data) => {
  try {
    const result = await axios.post(`${API_URI}/posts/comment/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const deleteComment = async (id, token, postId) => {
  try {
    const result = await axios.delete(
      `${API_URI}/posts/comment/${id}/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return result?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const updateUser = async (token, data) => {
  try {
    const result = await axios.put(`${API_URI}/users/update-user`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const getWriterInfo = async (id) => {
  try {
    const { data } = await axios.get(`${API_URI}/users/user/${id}`);

    return data?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const followWriter = async (id, token) => {
  try {
    const result = await axios.post(`${API_URI}/users/follow/${id}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const unFollowWriter = async (id, token) => {
  try {
    const result = await axios.post(`${API_URI}/users/unfollow/${id}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const deleteUser = async (id, token) => {
  console.log(id, token);
  try {
    const result = await axios.delete(`${API_URI}/users/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result?.data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    console.log(error);

    return err;
  }
};

export const verifyUser = async (id, otp, token) => {
  try {
    const { data } = await axios.post(`${API_URI}/users/verify/${id}/${otp}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    return err;
  }
};

export const resendOTP = async (id) => {
  try {
    const { data } = await axios.post(`${API_URI}/users/resend-link/${id}`);
    return data;
  } catch (error) {
    const err = error?.response?.data || error?.response;
    return err;
  }
};
