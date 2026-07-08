#!/usr/bin/env python3
import os
import re

pages_dir = './client/src/pages'
files = sorted([f for f in os.listdir(pages_dir) if f.endswith('.tsx')])

# Generate import statements
imports = []
for file in files:
    name = file.replace('.tsx', '')
    imports.append(f"const {name} = lazy(() => import('./pages/{name}'));")

# Generate routes
routes = []
for file in files:
    name = file.replace('.tsx', '')
    # Convert CamelCase to kebab-case
    path = re.sub(r'([A-Z])', r'-\1', name).lower()
    path = '/' + path.lstrip('-')
    routes.append(f'<Route path="{path}" component={{{name}}} />')

# Create the App.tsx file
imports_str = '\n'.join(imports)
routes_str = '\n        '.join(routes)

app_tsx = f'''import {{ lazy, Suspense }} from "react";
import {{ Switch, Route }} from "wouter";
import {{ ThemeProvider }} from "@/contexts/ThemeContext";
import {{ TooltipProvider }} from "@/components/ui/tooltip";
import {{ ErrorBoundary }} from "@/components/ErrorBoundary";
import {{ Toaster }} from "@/components/ui/sonner";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Lazy load all {len(files)} pages
{imports_str}

function Router() {{
  return (
    <Suspense fallback={{<div className="flex items-center justify-center min-h-screen"><div className="text-lg">Loading...</div></div>}}>
      <Switch>
        <Route path="/" component={{Home}} />
        {routes_str}
        <Route path="/404" component={{NotFound}} />
        {{/* Final fallback route */}}
        <Route component={{NotFound}} />
      </Switch>
    </Suspense>
  );
}}

function App() {{
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}}

export default App;
'''

with open('./client/src/App.tsx', 'w') as f:
    f.write(app_tsx)

print(f"Generated App.tsx with {len(files)} pages and {len(routes)} routes")
