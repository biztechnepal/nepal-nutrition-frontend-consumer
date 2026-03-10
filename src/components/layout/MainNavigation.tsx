"use client";

import React, { Suspense } from "react";
import Header from "./Header";
import { FilterBar } from "./FilterBar";

const MainNavigation = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md shadow-sm border-b border-border/40">
      <Header />
      <Suspense fallback={null}>
        <FilterBar />
      </Suspense>
    </div>
  );
};

export default MainNavigation;
