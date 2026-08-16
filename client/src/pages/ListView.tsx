import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ListView() {
  const [state, setState] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-black p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">ListView</h1>
        <p className="text-slate-400 mb-8">list view</p>
        
        <Card className="bg-slate-900 border-slate-800 p-8">
          <div className="space-y-6">
            <p className="text-slate-300">Content for ListView page</p>
            <Button onClick={() => setState(!state)}>
              {state ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
