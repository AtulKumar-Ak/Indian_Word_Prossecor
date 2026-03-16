"use client";

import { useMutation, useQuery } from "convex/react";
// This imports the backend API we defined in convex/documents.ts
import { api } from "../../convex/_generated/api"; 
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import SignInPage from "./(auth)/signin/signin";

export default function Home() {
  // 1. Hook to fetch your existing documents
  const documents = useQuery(api.documents.get);
  
  // 2. Hook to CREATE a new document
  const createDocument = useMutation(api.documents.create);

  // 3. The function that runs when you click the button
  const onCreate = () => {
    console.log("Button clicked!"); // Debugging log

    createDocument({ title: "Untitled Document" })
      .then((documentId) => {
        console.log("Created document:", documentId);
        // Redirect to the new dynamic ID
        window.location.href = `/documents/${documentId}`;
      })
      .catch((error) => {
        console.error("Error creating document:", error);
        alert("Failed to create: " + error);
      });
  };

  return (
    <div className="min-h-screen">
      <SignedOut>
        <div className="min-h-screen bg-[#0b0d0f] text-white">
          <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute -left-24 top-[-140px] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_top,#ffb454,transparent_65%)] opacity-70 blur-2xl" />
            <div className="pointer-events-none absolute -right-32 top-16 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_top,#44c2ff,transparent_60%)] opacity-60 blur-2xl" />
            <div className="pointer-events-none absolute bottom-[-120px] left-1/3 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_top,#ff7a7a,transparent_62%)] opacity-60 blur-2xl" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.01)_45%,rgba(255,255,255,0)_100%)]" />
            <div className="relative z-10">
              <SignInPage />
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex min-h-screen flex-col items-center p-24 bg-background text-foreground">
          <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-10">
            <p className="text-2xl font-bold">BharatDocs 🇮🇳</p>
            <UserButton afterSignOutUrl="/" />
          </div>

          <div className="flex flex-col items-center gap-4 w-full">
            <button
              onClick={onCreate}
              className="
                px-6 py-3
                bg-primary
                text-primary-foreground
                font-bold
                rounded-xl
                hover:opacity-90
                transition
                shadow-md
              "
            >
              + Create New Document
            </button>

            <div className="mt-10 w-full max-w-2xl">
              <h2 className="text-xl font-bold mb-4 border-b border-border pb-2">
                Your Documents
              </h2>

              {documents === undefined ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : documents.length === 0 ? (
                <p className="text-muted-foreground">
                  No documents found. Click the button above!
                </p>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc._id}
                    onClick={() =>
                      (window.location.href = `/documents/${doc._id}`)
                    }
                    className="
                      p-4
                      border border-border
                      bg-card
                      rounded-xl
                      mb-3
                      hover:bg-muted
                      cursor-pointer
                      flex
                      justify-between
                      items-center
                      transition
                      shadow-sm
                    "
                  >
                    <span className="font-medium">{doc.title}</span>

                    <span className="text-xs text-muted-foreground">
                      {new Date(doc._creationTime).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}