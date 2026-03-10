import { ContactView } from "@/features/Contact/ContactView";
import { Suspense } from "react";

export default function ContactPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactView />
    </Suspense>
  );
}
