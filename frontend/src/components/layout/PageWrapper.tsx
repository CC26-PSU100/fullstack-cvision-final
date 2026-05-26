import React from "react";
import { Header } from "./Header";

interface PageWrapperProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ title, children, className }: PageWrapperProps) {
  return (
    <div className="min-h-full flex flex-col selection:bg-primary/20">
      <Header title={title} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className={className}>
          {children}
        </div>
      </main>
    </div>
  );
}
