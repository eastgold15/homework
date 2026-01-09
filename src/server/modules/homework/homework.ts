import { Elysia, t } from "elysia";
import { homeworkService } from "./homework.service";

const homeworkRoutes = new Elysia({ prefix: "/homework" })
  .get("/list", async () => {
    return homeworkService.getHomeworkList();
  })
  .post("/download", async () => {
    return homeworkService.downloadAttachments();
  })
  .delete("/delete/:id", async ({ params: { id } }) => {
    return homeworkService.deleteHomework(Number.parseInt(id, 10));
  })
  .post(
    "/rename",
    async ({ body: { id, fileName } }) => {
      return homeworkService.renameHomework(id, fileName);
    },
    {
      body: t.Object({
        id: t.Number(),
        fileName: t.String(),
      }),
    }
  );

export default homeworkRoutes;
