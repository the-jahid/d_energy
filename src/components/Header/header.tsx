import Link from "next/link"
import { Mic } from "lucide-react"
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Mic className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Ariana</span>
        </div>
         <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <Button className="bg-black cursor-pointer"><SignInButton /></Button>
              <Button className="bg-black cursor-pointer"><SignUpButton /></Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
             <Link href={'/dashboard'} > <Button className="bg-black cursor-pointer">Dashboard</Button></Link>
            </SignedIn>
          </header>
      </div>
    </header>
  )
}
