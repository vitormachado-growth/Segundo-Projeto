'use client';

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import styles from "./CalEmbed.module.css";

interface CalEmbedProps {
  calLink: string;
}

export default function CalEmbed({ calLink }: CalEmbedProps) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "dark",
        styles: {
          branding: {
            brandColor: "#d4af37", // Matches --accent-color
          },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <div className={styles.container}>
      <Cal
        calLink={calLink}
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{ layout: "month_view", theme: "dark" }}
      />
    </div>
  );
}
