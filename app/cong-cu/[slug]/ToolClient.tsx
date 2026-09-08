"use client";

import type { Tool } from "@/lib/tools";
import ToolRunner from "@/components/ToolRunner";

export default function ToolClient({ tool }: { tool: Tool }) {
  return <ToolRunner tool={tool} />;
}
