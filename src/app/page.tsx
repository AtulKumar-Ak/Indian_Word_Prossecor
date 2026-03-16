"use client";

import { useMutation, useQuery } from "convex/react";
// This imports the backend API we defined in convex/documents.ts
import { api } from "../../convex/_generated/api"; 
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

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
  <div className="flex min-h-screen flex-col items-center p-24 bg-background text-foreground">
    
    {/* Header */}
    <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-10">
      <p className="text-2xl font-bold">BharatDocs 🇮🇳</p>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>

    <div className="flex flex-col items-center gap-4 w-full">
      
      {/* Signed Out */}
      <SignedOut>
        <h1 className="text-4xl font-bold mb-4">
          Welcome to BharatDocs
        </h1>

        <div className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-80 transition cursor-pointer">
          <SignInButton mode="modal" />
        </div>
      </SignedOut>

      {/* Signed In */}
      <SignedIn>

        {/* Create Button */}
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

        {/* Documents List */}
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
      </SignedIn>

    </div>
  </div>
);
}