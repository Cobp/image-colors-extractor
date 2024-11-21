"use client";
import {
  IconCheckCircle,
  IconCloseCircle,
  IconDangerTriangle,
  IconInfoCircle,
} from "../../icons/Icons";
import { motion, AnimatePresence } from "framer-motion"; 
import { useEffect, useState } from "react";
import { useColorProvider } from "../../providers/ColorProvider";

const NotificationToast = () => {
  const { notification, setNotification } = useColorProvider();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (notification.length > 0) {
      const latestNotification = notification[notification.length - 1];
      if (latestNotification) {
        latestNotification.status === 200 && setStatus("Success");
        latestNotification.status === 300 && setStatus("Information");
        latestNotification.status === 400 && setStatus("Error");
        latestNotification.status === 500 && setStatus("Warning");
      }

      setTimeout(() => setNotification([]), 10000);
    }
  }, [notification]);

  return (
    <AnimatePresence mode="wait">
      {notification.length > 0 && (
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 10,
          }}
          className="absolute bottom-6 right-6 z-50 rounded-2xl shadow-2xl"
        >
          <motion.div
            className={`relative text-xs flex gap-2 p-4 bg-gradient-to-l from-white border-2 border-neutral-100 rounded-2xl overflow-hidden w-80 ${
              status === "Success"
                ? "to-green-100"
                : status === "Information"
                ? "to-blue-100"
                : status === "Error"
                ? "to-red-100"
                : "to-yellow-100"
            }`}
          >
            <i
              className={`min-w-8 ${
                status === "Success"
                  ? "text-green-500"
                  : status === "Information"
                  ? "text-blue-500"
                  : status === "Error"
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}
            >
              {status === "Success" ? (
                <IconCheckCircle />
              ) : status === "Information" ? (
                <IconInfoCircle />
              ) : status === "Error" ? (
                <IconCloseCircle />
              ) : (
                <IconDangerTriangle />
              )}
            </i>
            <p>
              <span className="font-bold mr-1">{status}:</span>
              <span>{notification[notification.length - 1]?.message}</span>
            </p>
            <motion.span
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 10,
                ease: "linear",
              }}
              className={`absolute bottom-0 left-0 h-0.5 ${
                status === "Success"
                  ? "bg-green-500"
                  : status === "Information"
                  ? "bg-blue-500"
                  : status === "Error"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            ></motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;
