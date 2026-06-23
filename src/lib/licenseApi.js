const LICENSE_API = process.env.NEXT_PUBLIC_LICENSE_API_URL;

export async function validateLicense(appKey) {
  try {
    const res = await fetch(`${LICENSE_API}/api/license/validate/${appKey}`, {
      cache: 'no-store',
    });
    return await res.json();
  } catch {
    return null;
  }
}