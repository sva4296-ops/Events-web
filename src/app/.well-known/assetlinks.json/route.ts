/**
 * Android App Links verification: lets https://<this site>/i/<token> open the
 * installed app (Events repo, app.json intentFilters) instead of the browser.
 * ANDROID_SHA256_FINGERPRINTS is a comma-separated list of the app's signing
 * certificate SHA-256 fingerprints (EAS keystore, plus Play App Signing's key
 * once the app ships through Google Play).
 */
const ANDROID_PACKAGE = "com.povesteanoastra.app";

export function GET() {
  const fingerprints = (process.env.ANDROID_SHA256_FINGERPRINTS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  return Response.json([
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: { namespace: "android_app", package_name: ANDROID_PACKAGE, sha256_cert_fingerprints: fingerprints },
    },
  ]);
}
