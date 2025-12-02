import { Lti } from "@liga/lti13";

const lti = new Lti({
  loginUrl: process.env.CANVAS_LOGIN_URL,
  launchUrl: process.env.LTI_LAUNCH_URL,
  privateKey: process.env.LTI_PRIVATE_KEY,
  publicKey: process.env.LTI_PUBLIC_KEY,
});

export async function POST(req) {
  const body = await req.formData();
  const idToken = body.get("id_token");

  const launchData = await lti.validate(idToken);

  return Response.json({
    user: launchData.user,
    course: launchData.context,
    roles: launchData.roles,
  });
}
