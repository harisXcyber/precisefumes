import { Suspense } from "react";
import { VerifyContent } from "./verify-content";

export const dynamic = "force-dynamic";

export default function AffiliateVerify() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
