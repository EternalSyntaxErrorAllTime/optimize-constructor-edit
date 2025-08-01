import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material";

import BackupTableIcon from "@mui/icons-material/BackupTable";
// import InfoIcon from "@mui/icons-material/Info";

export type TypeItemRouter = {
  Icon: OverridableComponent<SvgIconTypeMap>;
  title: string;
  links: string;
};

export type TypeRouter = Record<string, TypeItemRouter>;

const ROUTER: TypeRouter = {
  cardCatalog: { Icon: BackupTableIcon, title: "Картотека", links: "/" },
  // guideline: { Icon: InfoIcon, title: "Руководство", links: "/guideline" },
};

export default ROUTER;
