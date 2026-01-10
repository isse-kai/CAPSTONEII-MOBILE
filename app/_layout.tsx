import { DripsyProvider } from "dripsy";
import { Slot } from "expo-router";
import React, { useEffect } from "react";
import { theme } from "../theme";

import { supabase } from "../supabase/db"; // adjust path to where your db.ts actually is
import { hardResetSupabaseAuth } from "../supabase/hardResetAuth";

export default function Layout() {
  useEffect(() => {
    (async () => {
      try {
        // touching session early exposes bad stored tokens immediately
        const { error } = await supabase.auth.getSession();
        if (error) throw error;
      } catch (e: any) {
        const msg = String(e?.message || e);

        if (
          msg.includes("Invalid Refresh Token") ||
          msg.includes("Refresh Token Not Found")
        ) {
          // Clear corrupted local auth state and force sign-out
          await hardResetSupabaseAuth();
          await supabase.auth.signOut();
        }
      }
    })();
  }, []);

  return (
    <DripsyProvider theme={theme}>
      <Slot />
    </DripsyProvider>
  );
}
