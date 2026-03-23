import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1. Function to CREATE a new blank document (UPDATED FOR TEMPLATES)
export const create = mutation({
  args: { 
    title: v.string(),
    initialContent: v.optional(v.string()) // NEW: Allow frontend to pass template JSON
  }, 
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      ownerId: identity.subject,
      // NEW: Use the provided template content, OR default to a safe blank TipTap document
      initialContent: args.initialContent || '{"type":"doc","content":[{"type":"paragraph"}]}',
    });

    return documentId;
  },
});

// 2. Function to GET all documents (Using Filter Fix)
export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.db
      .query("documents")
      .filter((q) => q.eq(q.field("ownerId"), identity.subject))
      .collect();
  },
});

// 3. Function to GET a single document by its ID
export const getById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("Not found");
    }
    if (!identity) {
      throw new Error("Unauthorized: You must be logged in to view this document");
    }
    // --- 👇 ADD THESE LOGS TO DEBUG 👇 ---
    console.log("WHO AM I?", identity?.subject);
    console.log("WHO OWNS THIS DOC?", document.ownerId);
    // -------------------------------------

    // Security: Only allow the owner (or public) to see it
    // if (document.ownerId !== identity?.subject) {
    //   throw new Error("Unauthorized");
    // }

    return document;
  },
});

// 4. Function to UPDATE a document (Title or Content)
export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()), // Useful later
    icon: v.optional(v.string()),       // Useful later
    isPublished: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const { id, ...rest } = args;

    // Security: Check if document exists and belongs to user
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Not found");
    }
    // if (existingDocument.ownerId !== identity.subject) {
    //   throw new Error("Unauthorized");
    // }

    // Update the document with whatever new data was sent
    // const document = await ctx.db.patch(args.id, {
    //   ...rest,
    // });
    // NEW LOGIC: Allow update if user is the owner. 
    // If you want guest editors, relax this check like we did in getById.
    const isOwner = existingDocument.ownerId === identity.subject;
    
    if (!isOwner) {
       // Optional: For now, we might allow other logged in users to edit 
       // to test the live collaboration system.
       // throw new Error("Unauthorized"); 
    }

    const document = await ctx.db.patch(args.id, {
      ...rest,
    });

    return document;
  },
});

// 5. Function to DELETE a document
export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    // Security check: Only the owner can delete their own document
    if (existingDocument.ownerId !== identity.subject) {
      throw new Error("Unauthorized: Only the owner can delete this document");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});