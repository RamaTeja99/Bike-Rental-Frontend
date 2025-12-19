export const digiLockerService = {
  initiateDigiLockerFlow(): string {
    const clientId = process.env.NEXT_PUBLIC_DIGILOCKER_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_DIGILOCKER_REDIRECT_URI;
    const state = Math.random().toString(36).substring(7);

    // Store state in sessionStorage for verification
    if (typeof window !== "undefined") {
      sessionStorage.setItem("digilocker_state", state);
    }

    const params = new URLSearchParams({
      client_id: clientId || "",
      redirect_uri: redirectUri || "",
      response_type: "code",
      state,
      scope: "profile document",
    });

    return `https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize?${params.toString()}`;
  },

  openDigiLockerConsent(url: string): void {
    if (typeof window !== "undefined") {
      window.location.href = url;
    }
  },

  verifyState(state: string): boolean {
    if (typeof window !== "undefined") {
      const storedState = sessionStorage.getItem("digilocker_state");
      return storedState === state;
    }
    return false;
  },
};
