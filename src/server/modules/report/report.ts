import { Elysia } from "elysia";
import { reportService } from "./report.service";

const reportRoutes = new Elysia({ prefix: "/report" }).get(
  "/export",
  async () => {
    return reportService.exportReport();
  }
);

export default reportRoutes;
