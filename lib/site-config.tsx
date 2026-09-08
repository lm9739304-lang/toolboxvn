"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_AD_ZONES, AdZone, AdZoneId } from "./ads";
import { TOOLS } from "./tools";

const KEY = "toolboxvn:v1";

export type SiteConfig = {
  disabledTools: string[];
  featuredTools: string[];
  adZones: AdZone[];
  siteName: string;
  adminPass: string;
};

const DEFAULT_CONFIG: SiteConfig = {
  disabledTools: [],
  featuredTools: ["tao-mat-khau", "dem-tu", "json-formatter", "tao-ma-qr", "tinh-bmi", "doi-tien-te", "tao-slug", "ma-hoa-base64"],
  adZones: DEFAULT_AD_ZONES,
  siteName: "ToolBox VN",
  adminPass: "admin123",
};

function loadConfig(): SiteConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      adZones: DEFAULT_AD_ZONES.map((d) => ({
        ...d,
        ...(parsed.adZones?.find((z: AdZone) => z.id === d.id) ?? {}),
      })),
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

type Ctx = {
  config: SiteConfig;
  setConfig: (c: SiteConfig) => void;
  update: (patch: Partial<SiteConfig>) => void;
  reset: () => void;
  isToolEnabled: (slug: string) => boolean;
  isAdEnabled: (id: AdZoneId) => boolean;
  getAdZone: (id: AdZoneId) => AdZone | undefined;
  enabledTools: typeof TOOLS;
};

const SiteCtx = createContext<Ctx | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConfigState(loadConfig());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(config));
    } catch {}
  }, [config, ready]);

  const value = useMemo<Ctx>(() => {
    const setConfig = (c: SiteConfig) => setConfigState(c);
    const update = (patch: Partial<SiteConfig>) => setConfigState((p) => ({ ...p, ...patch }));
    const reset = () => setConfigState(DEFAULT_CONFIG);
    const isToolEnabled = (slug: string) => !config.disabledTools.includes(slug);
    const isAdEnabled = (id: AdZoneId) => config.adZones.find((z) => z.id === id)?.enabled ?? false;
    const getAdZone = (id: AdZoneId) => config.adZones.find((z) => z.id === id);
    const enabledTools = TOOLS.filter((t) => !config.disabledTools.includes(t.slug));
    return { config, setConfig, update, reset, isToolEnabled, isAdEnabled, getAdZone, enabledTools };
  }, [config]);

  return <SiteCtx.Provider value={value}>{children}</SiteCtx.Provider>;
}

export function useSite(): Ctx {
  const ctx = useContext(SiteCtx);
  if (!ctx) {
    // Fallback khi render static (chưa có provider): dùng default
    return {
      config: DEFAULT_CONFIG,
      setConfig: () => {},
      update: () => {},
      reset: () => {},
      isToolEnabled: () => true,
      isAdEnabled: (id) => DEFAULT_AD_ZONES.find((z) => z.id === id)?.enabled ?? false,
      getAdZone: (id) => DEFAULT_AD_ZONES.find((z) => z.id === id),
      enabledTools: TOOLS,
    };
  }
  return ctx;
}

export { DEFAULT_CONFIG, KEY };
