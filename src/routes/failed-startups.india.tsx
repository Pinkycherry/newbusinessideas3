import { createFileRoute } from "@tanstack/react-router";
import purchasedIndiaPage from "@/bought/research-2-bbi.html?raw";
import { boughtPage } from "@/bought/serve";
import menuPanels from "@/bought/menu-panels.json";
import menuBindings from "@/bought/menus.html?raw";
import sharedHeaderStyles from "@/components/v2/v2.css?raw";

export const Route = createFileRoute("/failed-startups/india")({
  server: {
    handlers: {
      GET: async () => {
        const page = purchasedIndiaPage
          .replace('<div id="bbi-india-header"></div>', menuPanels.header)
          .replace('<div id="bbi-india-footer"></div>', menuPanels.footer)
          .replace("</head>", `<style id="bbi-shared-header-styles">${sharedHeaderStyles}</style></head>`)
          .replace("</body>", `${menuBindings}</body>`);
        return boughtPage(page, "research-2");
      },
    },
  },
});
