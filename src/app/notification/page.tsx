"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import LoadingSpinner from "../components/Loading/Loading";

const NotificationList = dynamic(
  () => import("../components/Notification/NotificationList")
);

function Notification() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NotificationList />
    </Suspense>
  );
}

export default Notification;
