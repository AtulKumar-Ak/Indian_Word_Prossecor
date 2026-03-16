import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SparklesIcon, CopyIcon, CheckIcon, Loader2Icon, ArrowRightToLineIcon } from "lucide-react";
import { useEditorStore } from "@/store/use-editor-store";

export const AiSidebar = () => {
  const { editor, toggleAiSidebar } = useEditorStore();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setResponse("");

    try {
      // NOTE: This is where you will connect your backend API or RAG pipeline.
      // For now, it simulates a 2-second network request.
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await res.json();
      setResponse(data.text || "This is a placeholder AI response. Connect your API to see real results!");
    } catch (error) {
      setResponse("Failed to generate response. Please check your API connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsert = () => {
    if (editor && response) {
      // Inserts the AI response wherever the user's cursor currently is
      editor.chain().focus().insertContent(`\n${response}\n`).run();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-[350px] h-full bg-card border-l border-border flex flex-col shadow-xl z-30">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <SparklesIcon className="size-4 text-blue-500" />
          BharatDocs AI
        </div>
        <button onClick={toggleAiSidebar} className="text-muted-foreground hover:text-foreground text-xl leading-none">
          &times;
        </button>
      </div>

      {/* Input Area */}
      <div className="p-4 border-b border-border flex flex-col gap-3">
        <Textarea
          placeholder="Ask AI to write, rewrite, or summarize anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="resize-none h-28 text-sm bg-background"
        />
        <Button 
          onClick={handleGenerate} 
          disabled={isLoading || !prompt.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : <SparklesIcon className="size-4" />}
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </div>

      {/* Output Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-muted/10">
        {response ? (
          <div className="flex flex-col gap-4">
            <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {response}
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <Button onClick={handleInsert} size="sm" variant="default" className="flex-1 gap-2">
                <ArrowRightToLineIcon className="size-4" /> Insert to Doc
              </Button>
              <Button onClick={handleCopy} size="sm" variant="outline" className="px-3">
                {isCopied ? <CheckIcon className="size-4 text-green-500" /> : <CopyIcon className="size-4" />}
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-60">
            <SparklesIcon className="size-10 mb-2 opacity-20" />
            <p className="text-sm text-center px-4">Type a prompt above to generate content.</p>
          </div>
        )}
      </div>
    </div>
  );
};