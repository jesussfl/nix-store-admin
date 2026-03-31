import { addNavMenuSection } from "@vendure/admin-ui/core";

export default [
  addNavMenuSection(
    {
      id: "storefront-content",
      label: "Contenido",
      items: [
        {
          id: "storefront-news",
          label: "Noticias",
          routerLink: ["/extensions/storefront-news"],
          icon: "image",
        },
      ],
    },
    "Marketing"
  ),
];
