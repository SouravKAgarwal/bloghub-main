import { CATEGORIES } from "../utils/dummyData";
import {
  Banner,
  Card,
  Pagination,
  PopularPost,
  PopularWriters,
} from "../components";
import { Link } from "react-router-dom";
import { usePopularPosts, usePosts } from "../hooks/postHooks";

const Home = () => {
  const { posts, numOfPages, setPage } = usePosts({ writerId: "" });
  const popular = usePopularPosts();
  const randomIndex = Math.floor(Math.random() * posts.length);

  if (posts.length < 1)
    return (
      <div className="w-full h-full px-8 flex place-items-center justify-center">
        <span className="text-lg text-slate-500">No posts available!</span>
      </div>
    );

  const handlePageChange = (val) => {
    setPage(val);
  };

  return (
    <div className="py-10 2xl:py-5">
      <Banner post={posts[randomIndex]} />

      <div className="px-0 lg:pl-20 2xl:px-20">
        <div className="mt-6 md:mt-0">
          <p className="font-semibold text-gray-600 dark:text-white text-2xl">
            Popular Categories
          </p>
          <div className="w-full flex flex-wrap py-10 gap-8">
            {CATEGORIES.map((cat, index) => (
              <Link
                key={index}
                to={`/category?cat=${cat?.label}`}
                className={`flex items-center justify-center gap-3 ${cat.color} text-white font-semibold text-base px-4 py-2 rounded cursor-pointer`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-10 2xl:gap-20">
        <div className="w-full md:w-2/3 gap-y-20 gap-10 flex flex-col">
          {posts?.map((post, index) => (
            <Card key={post?._id} post={post} index={index} />
          ))}

          <div className="w-full flex items-center justify-center">
            <Pagination
              totalPages={numOfPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        <div className="w-full md:w-1/4 flex flex-col gap-y-12">
          <PopularPost posts={popular?.posts} />
          <PopularWriters data={popular?.writers} />
        </div>
      </div>
    </div>
  );
};

export default Home;
