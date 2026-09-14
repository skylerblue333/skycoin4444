import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Search, Settings } from "lucide-react";

export default function AIAssistant() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>AIAssistant</CardTitle>
            <CardDescription>Sign in to access this feature</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => startLogin()} className="w-full">Sign In</Button>
            <Link href="/hope-a-i" className="mt-3 block text-center text-xs font-semibold text-primary hover:underline">Open the developed HopeAI lab</Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">AIAssistant</h1>
            <p className="text-muted-foreground mt-2">AI helper interface</p>
          </div>
          <Button onClick={() => setSearchQuery("")}>
            <Plus className="w-4 h-4 mr-2" />
            New
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <Link href="/hope-a-i" aria-label="Open developed HopeAI lab" className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No data available. Start by creating a new item.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
