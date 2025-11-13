import { http, HttpResponse } from "msw";

import { findUserByCredentials } from "../data/auth.state";

interface LoginRequestBody {
  email?: string;
  password?: string;
}

export const authHandlers = [
  http.post("/api/v1/auth", async ({ request }) => {
    const body = (await request.json()) as LoginRequestBody;

    if (!body?.email || !body?.password) {
      return HttpResponse.json(
        {
          success: false,
          message: "Faltan credenciales.",
          code: 400,
        },
        { status: 400 }
      );
    }

    const user = findUserByCredentials(body.email, body.password);

    if (!user) {
      return HttpResponse.json(
        {
          success: false,
          message: "Credenciales incorrectas.",
          code: 401,
        },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      success: true,
      message: "Authentication successful",
      code: 200,
      data: {
        studyName: user.studyName,
        roleName: user.roleName,
        token: user.token,
      },
    });
  }),
];

