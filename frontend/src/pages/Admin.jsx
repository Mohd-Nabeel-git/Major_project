import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

export default function Admin() {
  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
          <p className="text-gray-500">Manage users, jobs, posts, and handle reports.</p>
        </CardHeader>
        <Separator />
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h2 className="font-semibold mb-2">User Search</h2>
            <Input placeholder="Search users by name or email" className="mb-2" />
            <Button className="w-full">Search</Button>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Job Moderation</h2>
            <Input placeholder="Search jobs by title or company" className="mb-2" />
            <Button className="w-full" variant="outline">Search</Button>
          </div>
          <div className="md:col-span-2">
            <h2 className="font-semibold mb-2">Report Center</h2>
            <Textarea placeholder="Review reported content here..." className="mb-2" />
            <div className="flex gap-2">
              <Button variant="destructive">Delete</Button>
              <Button variant="outline">Ignore</Button>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-end">
          <Button variant="secondary">Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}