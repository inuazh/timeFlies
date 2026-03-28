"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { checkAuth } from "@/features/auth";
import { Header } from "@/widgets/header";
import { Hero } from "@/widgets/hero";

export function LandingPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((s) => s.user.data);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
      return;
    }
    dispatch(checkAuth()).then((result) => {
      if (result.meta.requestStatus === "fulfilled" && result.payload) {
        router.push("/dashboard");
      }
    });
  }, [dispatch, user, router]);

  return (
    <>
      <Header />
      <main>
        <Hero />
      </main>
    </>
  );
}
