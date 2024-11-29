import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <main className="max-w-4xl w-full text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Pottery Work Tracking
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your pottery pieces from creation to completion. 
            Always know where your work is in the studio.
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">For Students</h2>
            <p className="text-gray-600">
              Document your pieces, track their progress, and receive notifications when they're ready.
            </p>
            <Link href="/student">
              <Button className="w-full" size="lg">
                Student Access
              </Button>
            </Link>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">For Instructors</h2>
            <p className="text-gray-600">
              Manage studio pieces, update statuses, and coordinate with students.
            </p>
            <Link href="/instructor">
              <Button className="w-full" variant="outline" size="lg">
                Instructor Access
              </Button>
            </Link>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8">
          {[
            {
              title: "Track Progress",
              description: "Follow your pieces through each stage of creation"
            },
            {
              title: "Get Notified",
              description: "Receive updates when your pieces are ready for pickup"
            },
            {
              title: "Stay Organized",
              description: "Always know where your work is in the studio"
            }
          ].map((feature) => (
            <div key={feature.title} className="text-center">
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}