import { Elysia, t } from "elysia";
import { homeworkService } from "./homework.service";

const homeworkRoutes = new Elysia({ prefix: "/homework" })
  .get("/list", async () => homeworkService.getHomeworkList())
  .post("/download", async () => homeworkService.downloadAttachments())
  .delete("/delete/:id", async ({ params: { id } }) =>
    homeworkService.deleteHomework(Number.parseInt(id, 10))
  )
  .post(
    "/rename",
    async ({ body: { id, fileName } }) =>
      homeworkService.renameHomework(id, fileName),
    {
      body: t.Object({
        id: t.Number(),
        fileName: t.String(),
      }),
    }
  );

export default homeworkRoutes;
