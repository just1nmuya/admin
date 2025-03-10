import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import prismadb from "@/lib/prismadb"
import { SettingsForm } from "./components/settings-form"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Update the type so that params is a Promise resolving to { storeId: string }
interface SettingPageProps {
  params: Promise<{ storeId: string }>
}

export default async function SettingsPage({ params }: SettingPageProps) {
  // Await params to extract storeId
  const { storeId } = await params
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  })

  if (!store) {
    redirect("/")
  }

  return (
    <div className="flex-col animate-in fade-in duration-500">
      <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8 pt-6">
        <div className="flex flex-col gap-2 slide-in-from-left-5 duration-300">
          <Heading title="Store Settings" description="Manage your store preferences" />
          <Separator />
        </div>

        <Card className="slide-in-from-bottom-5 duration-300 delay-100 overflow-hidden">
          <CardHeader className="px-6 py-4 bg-muted/30">
            <CardTitle>Store Configuration</CardTitle>
            <CardDescription>Update your store details and preferences</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <SettingsForm initialData={store} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

