"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Toggle } from "@/components/ui/toggle";
import { trpc } from "@/trpc/client";

export function CodeEditorWrapper() {
  const router = useRouter();
  const [roastMode, setRoastMode] = useState(true);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const charLimit = 2500;

  const createRoast = trpc.createRoast.useMutation({
    onSuccess: (data) => {
      router.push(`/roast/${data.roastId}`);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Limit to ~1000 lines to prevent performance issues
    const newCode = e.target.value;
    if (newCode.split("\n").length <= 1000) {
      setCode(newCode);
    } else {
      // Optional: slice to 1000 lines if we want to truncate instead of block
      const truncated = newCode.split("\n").slice(0, 1000).join("\n");
      setCode(truncated);
    }
  };

  const handleRoast = () => {
    setError(null);
    createRoast.mutate({
      code,
      language: "javascript", // Hardcoded for now
      roastMode: roastMode ? "brutal" : "normal",
    });
  };

  const isOverLimit = code.length > charLimit;
  const isButtonDisabled = !code.trim() || isOverLimit || createRoast.isPending;

  return (
    <div className="space-y-6">
      <CodeEditor
        value={code}
        onChange={handleCodeChange}
        filename="roasted_code.js"
        charLimit={charLimit}
      />

      {error && (
        <div className="text-accent-red text-sm font-mono border border-accent-red/20 bg-accent-red/5 p-3 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-2">
        <Toggle checked={roastMode} onCheckedChange={setRoastMode} label="roast mode" />
        <Button
          className="w-full sm:w-auto font-black italic tracking-tighter"
          disabled={isButtonDisabled}
          onClick={handleRoast}
        >
          {createRoast.isPending ? "roasting..." : "> roast_my_code"}
        </Button>
      </div>
    </div>
  );
}
