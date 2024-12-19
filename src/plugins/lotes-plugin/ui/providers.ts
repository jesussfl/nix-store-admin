import { addNavMenuSection } from "@vendure/admin-ui/core";

export default [
  addNavMenuSection(
    {
      id: "lotes",
      label: "My Extensions",
      items: [
        {
          id: "lotes",
          label: "Lotes",
          routerLink: ["/extensions/lotes"],
          // Icon can be any of https://core.clarity.design/foundation/icons/shapes/
          icon: "cursor-hand-open",
        },
      ],
    },
    // Add this section before the "settings" section
    "Sales"
  ),
];
