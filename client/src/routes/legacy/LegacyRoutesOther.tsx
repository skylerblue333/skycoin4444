import { lazy } from "react";
import { Route, Switch } from "wouter";
import NotFound from "@/pages/NotFound";



export default function LegacyRoutesOther() {
  return (
    <Switch>

      <Route component={NotFound} />
    </Switch>
  );
}
