import { Elysia, t } from "elysia";
import { studentService } from "./student.service";

const studentRoutes = new Elysia({ prefix: "/student" })
  .get("/list", async () => {
    return studentService.getStudents();
  })
  .get("/not-submit", async () => {
    return studentService.getNotSubmitted();
  })
  .post(
    "/upload",
    async ({ body: { file } }) => {
      return studentService.importFromExcel(file);
    },
    {
      body: t.Object({
        file: t.File(),
      }),
    }
  );

export default studentRoutes;
