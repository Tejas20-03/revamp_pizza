"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

export interface Config {
  displayType: "Card" | "Tile";
  // Add other config properties as needed
}

interface ConfigContextType {
  config: Config | null;
  loading: boolean;
}

export const ConfigContext = createContext<ConfigContextType>({
  config: null,
  loading: true,
});

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/config.json");
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        console.error("Error loading config:", error);
        setConfig({ displayType: "Card" });
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};
