import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useStore from "../store";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URI, updateUrl } from "../utils";
import { toast } from "sonner";

export const usePosts = ({ writerId }) => {
  const { setIsLoading } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(searchParams.get("page") || 1);
  // eslint-disable-next-line
  const [category, setCategory] = useState(searchParams.get("cat") || "");

  const [posts, setPosts] = useState([]);
  const [numOfPages, setNumOfPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      updateUrl({ page, navigate, location, cat: category });

      setIsLoading(true);

      try {
        const { data } = await axios.get(
          `${API_URI}/posts?cat=${category}&page=${page}&writerId=${
            writerId || ""
          }`
        );
        setPosts(data?.data || []);
        setNumOfPages(data?.numOfPages);
      } finally {
        setIsLoading(false);
      }
    };

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    fetchPosts();
    // eslint-disable-next-line
  }, [category, page, writerId]);

  return { page, posts, numOfPages, setPage, category };
};

export const usePopularPosts = () => {
  const [popular, SetPopular] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`${API_URI}/posts/popular`);
        SetPopular(data?.data);
      } catch (error) {
        toast.error("Something went wrong!");
        const err = error?.response?.data?.message || error?.message;

        console.log(error);
        return err;
      }
    };

    fetchPosts();
  }, []);
  return popular;
};

export const useComments = (id) => {
  const [data, setData] = useState(null);

  const fetchComment = async (id) => {
    const { data } = await axios.get(`${API_URI}/posts/comments/` + id);

    setData(data);
  };

  return { data, fetchComment };
};

export const useDeleteComment = (token) => {
  const { setIsLoading } = useStore();
  const [data, setData] = useState(null);

  const deleteComment = async ({ id, postId }) => {
    setIsLoading(true);
    const { data } = await axios.delete(
      `${API_URI}/posts/comment/${id}/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setIsLoading(false);

    setData(data);
  };
  return { data, deleteComment };
};

export const useContent = (toast, token) => {
  const [data, setData] = useState(null);
  const { setIsLoading } = useStore();

  const fetchContent = async (page) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_URI}/posts/admin-content?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLoading(false);

      setData(response.data);
      toast.success(response.data.message);
    } catch (error) {
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg ?? error?.message);
      if (errMsg === "Authentication failed") {
        localStorage.removeItem("userInfo");
      }
    }
  };

  return { data, fetchContent };
};

export const useAction = (toast, token) => {
  const performAction = async ({ id, status }) => {
    try {
      const response = await axios.put(
        `${API_URI}/posts/update/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg ?? error?.message);
      if (errMsg === "Authentication failed") {
        localStorage.removeItem("userInfo");
      }
    }
  };

  return { performAction };
};

export const useDeletePost = (toast, token) => {
  const deletePost = async (id) => {
    try {
      const response = await axios.delete(`${API_URI}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data.message);
    } catch (error) {
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg ?? error?.message);
      if (errMsg === "Authentication failed") {
        localStorage.removeItem("userInfo");
      }
    }
  };

  return { deletePost };
};
