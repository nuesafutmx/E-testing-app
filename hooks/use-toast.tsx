"use client"

import type React from "react"

// Inspired by react-hot-toast library
import { useState, useEffect, useCallback } from "react"

export type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toasts: ToasterToast[] = []

type Toast = Omit<ToasterToast, "id">

function addToRemoveQueue(toastId: string, setToasts: React.Dispatch<React.SetStateAction<ToasterToast[]>>) {
  setTimeout(() => {
    removeToast(toastId, setToasts)
  }, TOAST_REMOVE_DELAY)
}

export const useToast = () => {
  const [, setToasts] = useState<ToasterToast[]>(toasts)

  useEffect(() => {
    setToasts([...toasts])

    return () => {
      toasts.length = 0
    }
  }, [])

  const toast = useCallback(({ ...props }: Toast) => {
    const id = genId()

    const newToast = {
      ...props,
      id,
    }

    toasts.push(newToast)
    setToasts([...toasts])

    addToRemoveQueue(id, setToasts)

    return id
  }, [])

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      removeToast(toastId, setToasts)
    } else {
      toasts.forEach((toast) => {
        removeToast(toast.id, setToasts)
      })
    }
  }, [])

  // Duplicate removeToast function removed

  return {
    toast,
    dismiss,
    toasts,
  }
}

export function Toast({ ...props }: ToastProps) {
  return (
    <div className="group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border border-slate-200 p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full dark:border-slate-800">
      <div className="grid gap-1">
        {props.title && <div className="text-sm font-semibold">{props.title}</div>}
        {props.description && <div className="text-sm opacity-90">{props.description}</div>}
      </div>
      {props.action}
    </div>
  )
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <div key={toast.id} className="mb-2">
          <Toast {...toast} />
        </div>
      ))}
    </div>
  )
}

function removeToast(toastId: string, setToasts: React.Dispatch<React.SetStateAction<ToasterToast[]>>) {
  const index = toasts.findIndex((toast) => toast.id === toastId)
  if (index !== -1) {
    toasts.splice(index, 1)
    setToasts([...toasts])
  }
}


