import React from "react";
import MainNavigation from "@/components/layout/MainNavigation";
import Footer from "@/components/layout/Footer";
import ContentContainer from "@/components/layout/ContentContainer";

export default function WithoutFilterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainNavigation showFilter={false} />
      <ContentContainer>{children}</ContentContainer>
      <Footer />
    </>
  );
}
