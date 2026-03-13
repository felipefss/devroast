"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/ui/code-editor";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";

export function CodeEditorWrapper() {
  const [roastMode, setRoastMode] = useState(true);
  const [code, setCode] = useState("");

  return (
    <div className="space-y-6">
      <CodeEditor
        value={code}
        onChange={(e) => setCode(e.target.value)}
        filename="roasted_code.js"
      />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-2">
        <Toggle checked={roastMode} onCheckedChange={setRoastMode} label="roast mode" />
        <Button
          className="w-full sm:w-auto font-black italic tracking-tighter"
          disabled={!code.trim()}
        >
          {">"} roast_my_code
        </Button>
      </div>
    </div>
  );
}
