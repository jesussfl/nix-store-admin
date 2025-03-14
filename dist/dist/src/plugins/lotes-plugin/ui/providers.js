"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@vendure/admin-ui/core");
exports.default = [
    (0, core_1.addNavMenuSection)({
        id: "lotes",
        label: "Extensions",
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
    "Sales"),
];
