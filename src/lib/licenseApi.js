export async function validateLicense(appKey) {
    try {
      const res = await fetch(`/api/validate-license?appKey=${appKey}`, {
        cache: 'no-store',
      });
      return await res.json();
    } catch {
      return null;
    }
}