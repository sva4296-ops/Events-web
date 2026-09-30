/**
 * iOS Universal Links: lets https://<this site>/i/<token> open the installed
 * app (Events repo, app.json associatedDomains). APPLE_TEAM_ID is the Apple
 * Developer team id; without it no app is associated and links stay in Safari.
 */
const IOS_BUNDLE_ID = "com.povesteanoastra.app";

export function GET() {
  const teamId = process.env.APPLE_TEAM_ID?.trim();
  const appIDs = teamId !== undefined && teamId.length > 0 ? [`${teamId}.${IOS_BUNDLE_ID}`] : [];

  return Response.json({
    applinks: { details: [{ appIDs, components: [{ "/": "/i/*" }] }] },
  });
}
