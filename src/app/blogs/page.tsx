"use client";

import { getBlogList } from "@/services/Home/services";
import { PizzaArticle } from "@/services/Home/types";
import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { IoArrowBack } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/toaster/slice";

const BlogContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [blogs, setBlogs] = useState<PizzaArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<PizzaArticle | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const data = await getBlogList({});
        if (data?.ResponseType?.toString() === "1") {
          setBlogs(data.Data);
          const blogTitle = searchParams.get("blog");
          if (blogTitle) {
            const blog = data.Data.find(
              (b) =>
                b.Title.toLowerCase() ===
                decodeURIComponent(blogTitle).toLowerCase()
            );
            if (blog) setSelectedBlog(blog);
          }
        }
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [searchParams]);

  const handleBlogClick = (blog: PizzaArticle) => {
    dispatch(setLoading(true));
    setSelectedBlog(blog);
    router.push(`/blogs?blog=${encodeURIComponent(blog.Title.toLowerCase())}`, {
      scroll: false,
    });
    dispatch(setLoading(false));
  };

  const handleCloseBlog = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedBlog(null);
    router.push("/blogs", { scroll: false });
  };

  useEffect(() => {
    const handlePopState = () => {
      if (!searchParams.get("blog")) {
        setSelectedBlog(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [searchParams]);

  return (
    <div className="w-full px-4 flex flex-col items-center justify-center py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-[1200px] px-2">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#202020] rounded-lg overflow-hidden shadow-md"
              >
                <div className="w-full h-72 bg-gray-200 dark:bg-[#202020] animate-pulse" />
                <div className="p-4">
                  <div className="h-6 bg-gray-200 dark:bg-[#202020] rounded animate-pulse" />
                </div>
              </div>
            ))
          : blogs.map((blog, index) => (
              <div
                key={index}
                onClick={() => handleBlogClick(blog)}
                className="cursor-pointer bg-white dark:bg-[#202020] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative w-full h-72">
                  <Image
                    src={blog.CoverImage}
                    alt={blog.Title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-[14px] font-medium dark:text-white">
                    {blog.Title}
                  </h4>
                </div>
              </div>
            ))}
      </div>

      {selectedBlog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#202020] w-full h-screen max-w-[800px] rounded-none overflow-hidden shadow-xl animate-fadeIn">
            <div className="sticky top-0 bg-white dark:bg-[#202020] px-6 py-4 border-b flex items-center">
              <button
                type="button"
                onClick={handleCloseBlog}
                className="flex items-center bg-[var(--primary-light)] p-2 rounded-full cursor-pointer"
                aria-label="Back to blogs"
              >
                <IoArrowBack
                  size={24}
                  className="text-gray-700 dark:text-white"
                />
              </button>
              <h2 className="text-3xl font-extrabold flex-1 text-center text-gray-800 dark:text-white -ml-8">
                Feed
              </h2>
            </div>

            <div className="overflow-y-auto h-[calc(100vh-72px)]">
              <div className="relative w-full h-[400px]">
                {" "}
                <Image
                  src={selectedBlog.CoverImage}
                  alt={selectedBlog.Title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="p-6">
                <h3 className="text-3xl font-extrabold text-[#25a3a8] mb-4">
                  {selectedBlog.Title}
                </h3>
                <div
                  className="prose max-w-none text-gray-600 leading-relaxed dark:text-white"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.Content }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400" />
        </div>
      }
    >
      <BlogContent />
    </Suspense>
  );
};

export default Page;
