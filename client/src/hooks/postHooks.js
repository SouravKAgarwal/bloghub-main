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
