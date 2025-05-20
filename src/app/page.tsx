"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import { StoreDispatch, StoreState } from "@/redux/reduxStore";
import { addressesActions } from "@/redux/address/slice";
import { getMenu, getOptions } from "@/services/Home/services";
import { MenuCategory } from "@/services/Home/types";
import Cards from "@/components/Cards";
import HeroCarousel from "@/components/HeroCarousel";
import Tabs from "@/components/Tabs";
import GetApp from "@/components/GetApp";
import { login } from "@/redux/auth/slice";
import { initializeCartFromStorage } from "@/redux/cart/action";
import { debounce } from "lodash";
import StoriesCard from "@/components/StoriesCard";
import { useRouter } from "next/navigation";
import { useConfig } from "@/utils/useConfig";

const MemoizedCards = React.memo(Cards);
const MemoizedHeroCarousel = React.memo(HeroCarousel);
const MemoizedTabs = React.memo(Tabs);
const MemoizedStories = React.memo(StoriesCard);

const SkeletonLoader = React.memo(() => (
  <div className="w-full pb-[10px] mt-4 bg-background px-0 md:px-40">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 max-w-[1400px] mx-auto p-4">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col p-2 rounded-xl shadow-md bg-white"
        >
          <div className="w-full h-[180px] bg-gray-200 animate-pulse rounded-xl mb-2" />
          <div className="flex justify-between items-center mb-2">
            <div className="h-6 w-16 bg-gray-200 animate-pulse rounded" />
            <div className="h-6 w-20 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-2" />
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
        </div>
      ))}
    </div>
  </div>
));

const SEOHead = () => (
  <Head>
    <title>Order Broadway Pizza Pakistan Online - Best Pizza Deals</title>
    <meta
      name="description"
      content="Broadway Pizza is offering online ordering services in Pakistan. Order now and get amazing discounts and coupons on pizza deals and other fast food."
    />
    <meta
      name="keywords"
      content="pizza delivery, pakistan pizza, broadway pizza, online pizza ordering"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="canonical" href="https://broadwaypizza.com.pk" />
    <meta
      property="og:title"
      content="Broadway Pizza Pakistan - Online Ordering"
    />
    <meta
      property="og:description"
      content="Order pizza online from Broadway Pizza Pakistan"
    />
  </Head>
);

const Home = () => {
  const router = useRouter();
  const [pageState, setPageState] = useState({
    tabs: [] as string[],
    isLoading: true,
    menu: [] as MenuCategory[],
    isMobile: false,
  });
  const { config, loading: configLoading } = useConfig();

  const dispatch = useDispatch<StoreDispatch>();
  const addressState = useSelector((state: StoreState) => state.address);

  // Inside the fetchMenuData callback
  const fetchMenuData = useCallback(
    async (city: string, location: string, addressType: string) => {
      setPageState((prev) => ({ ...prev, isLoading: true }));
      try {
        const data = await getMenu(city, location, addressType, {});
        const categoryNames: string[] = [];

        data?.Data.NestedMenuForMobile[0]?.MenuCategoryList.forEach(
          (menuCategory: any) => {
            categoryNames.push(menuCategory.Name);
          }
        );

        setPageState((prev) => ({
          ...prev,
          menu: data?.Data?.NestedMenuForMobile[0]?.MenuCategoryList || [],
          tabs: categoryNames,
          isLoading: false,
        }));

        const urlParams = new URLSearchParams(window.location.search);
        const productParam = urlParams.get("product");

        if (productParam) {
          const [productId] = productParam.split("-");
          let foundProduct = null;

          data?.Data?.NestedMenuForMobile[0]?.MenuCategoryList.forEach(
            (category: any) => {
              const product = category.MenuItemsList.find(
                (item: any) => item.ID === productId
              );
              if (product) {
                foundProduct = product;
              }
            }
          );

          if (foundProduct) {
            router.push(`/product/${productId}`);
          }
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
        setPageState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [router]
  );

  useEffect(() => {
    const initializeApp = async () => {
      dispatch(initializeCartFromStorage());
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        dispatch(login(JSON.parse(storedUserData)));
      }

      const savedAddress = localStorage.getItem("address");
      if (savedAddress) {
        const parsedAddress = JSON.parse(savedAddress);
        const navigationEntry = performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;

        dispatch(
          addressesActions.setAddresses({
            ...parsedAddress,
            modalOpen:
              window.location.pathname === "/" &&
              navigationEntry.type === "reload",
          })
        );

        const location =
          parsedAddress.addressType === "Pickup"
            ? parsedAddress.outlet
            : parsedAddress.area;
        if (parsedAddress.city) {
          fetchMenuData(
            parsedAddress.city,
            location || "",
            parsedAddress.addressType || ""
          );
        }
      } else {
        dispatch(addressesActions.setAddresses({ modalOpen: true }));
        fetchMenuData("", "", "");
      }
    };

    initializeApp();
  }, [dispatch, fetchMenuData]);

  useEffect(() => {
    const handleResize = debounce(() => {
      setPageState((prev) => ({ ...prev, isMobile: window.innerWidth < 1024 }));
    }, 250);

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (addressState.city) {
      const location =
        addressState.addressType === "Pickup"
          ? addressState.outlet
          : addressState.area;
      fetchMenuData(
        addressState.city,
        location || "",
        addressState.addressType || ""
      );
    }
  }, [
    addressState.city,
    addressState.outlet,
    addressState.area,
    addressState.addressType,
    fetchMenuData,
  ]);

  return (
    <>
      <SEOHead />
      {pageState.tabs.length > 0 && (
        <MemoizedTabs tabs={pageState.tabs} isLoading={pageState.isLoading} />
      )}
      <MemoizedStories />
      {pageState.isMobile && <GetApp showFullContent={false} />}

      {pageState.isLoading || configLoading ? (
        <SkeletonLoader />
      ) : (
        pageState.menu?.map((item, index) => (
          <MemoizedCards
            key={index}
            isLoading={false}
            data={item.MenuItemsList}
            heading={item.Name}
            displayType={config?.displayType || "Card"}
          />
        ))
      )}
    </>
  );
};

export default React.memo(Home);
