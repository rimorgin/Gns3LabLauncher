"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@clnt/lib/utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  randomizeBg,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & {
  randomizeBg?: boolean;
}) {
  const colors = [
    { bg: "bg-purple-100", text: "text-purple-600" },
    { bg: "bg-blue-100", text: "text-blue-600" },
    { bg: "bg-green-100", text: "text-green-600" },
    { bg: "bg-yellow-100", text: "text-yellow-600" },
    { bg: "bg-pink-100", text: "text-pink-600" },
    { bg: "bg-red-100", text: "text-red-600" },
    { bg: "bg-indigo-100", text: "text-indigo-600" },
  ];

  const randomColor = randomizeBg
    ? colors[Math.floor(Math.random() * colors.length)]
    : undefined;

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        randomColor?.bg,
        randomColor?.text,
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
