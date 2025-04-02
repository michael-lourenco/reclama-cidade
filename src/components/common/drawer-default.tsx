"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react";
import { PiWarningCircle } from "react-icons/pi";

interface DialogProblemsProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export function DialogProblems({
  title,
  description,
  children,
  onSubmit,
  onCancel,
}: DialogProblemsProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="floating"
            size="icon"
            className="shadow-md rounded-full h-12 w-12"
            title="Reportar problema"
          >
            <PiWarningCircle className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <form className="grid items-start gap-4">
            {children}
            <Button variant="default" onClick={onSubmit}>
              Ok
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </DrawerClose>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="floating"
          size="icon"
          className="shadow-md rounded-full h-12 w-12"
          title="Reportar problema"
        >
          <PiWarningCircle className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex justify-between">{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        <form className="grid items-start gap-4">
          <div className="mx-4">{children}</div>
          <DrawerFooter className="pt-2">
            <Button variant="default" onClick={onSubmit}>
              Ok
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerPortal>
    </Drawer>
  );
}
