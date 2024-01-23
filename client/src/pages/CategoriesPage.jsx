import { Card, Pagination, PopularPost, PopularWriters } from "../components";
import { usePopularPosts, usePosts } from "../hooks/postHooks";

const CategoriesPage = () => {
  const { posts, numOfPages, setPage } = usePosts({ writerId: "" });
  const popular = usePopularPosts();

  const query = new URLSearchParams(window.location.search).get("cat");

  const handlePageChange = (val) => {
    setPage(val);
  };

  return (
    <div className="px-0 2xl:px-20">
      <div className="py-5">
        <h2 className="text-4xl 2xl:text-5xl font-semibold text-slate-800 dark:text-white">
          {query}
        </h2>
      </div>
      <div className="w-full flex flex-col md:flex-row gap-10 2xl:gap-20">
        <div className="w-full md:w-2/3 flex flex-col gap-10">
          {posts?.length === 0 ? (
            <div className="w-full h-full py-8 flex justify-center">
              <span className="text-lg text-slate-500">
                No post available for this category
              </span>
            </div>
          ) : (
            <>
              {posts?.map((post) => (
                <Card key={post?.id} post={post} />
              ))}

              <div className="flex w-full items-center justify-center">
                <Pagination
                  totalPages={numOfPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
        <div className="w-full md:w-1/4 flex flex-col gap-y-12">
          <PopularPost posts={popular?.posts} />
          <PopularWriters data={popular?.writers} />
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
