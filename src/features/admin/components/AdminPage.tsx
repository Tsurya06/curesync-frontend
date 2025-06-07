import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, UserPlus, Settings, ShieldAlert } from "lucide-react";

const AdminPage = () => {
  const { t } = useTranslation();

  // Dummy users data
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "admin",
      status: "active",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "user",
      status: "inactive",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      role: "user",
      status: "active",
    },
    {
      id: 5,
      name: "Charlie Wilson",
      email: "charlie@example.com",
      role: "user",
      status: "active",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, settings, and system configuration
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System Settings
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage user accounts and permissions
                  </CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Input placeholder="Search users..." className="pl-8" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </div>
                  <Button variant="outline">Filter</Button>
                </div>

                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Name
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Email
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Role
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Status
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle">{user.name}</td>
                            <td className="p-4 align-middle">{user.email}</td>
                            <td className="p-4 align-middle">
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                  user.role === "admin"
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                                }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-4 align-middle">
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                  user.status === "active"
                                    ? "bg-green-500/10 text-green-500"
                                    : "bg-destructive/10 text-destructive"
                                }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive">
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>1</strong> to <strong>5</strong> of{" "}
                    <strong>50</strong> results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure global application settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* General Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">General</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="app-name">Application Name</Label>
                      <Input id="app-name" defaultValue="Admin Dashboard" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="app-url">Application URL</Label>
                      <Input id="app-url" defaultValue="https://example.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="app-description">
                      Application Description
                    </Label>
                    <textarea
                      id="app-description"
                      rows={3}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="Admin dashboard for managing application settings."
                    />
                  </div>
                </div>

                {/* Email Settings */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-medium">Email Configuration</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="mail-driver">Mail Driver</Label>
                      <select
                        id="mail-driver"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option>SMTP</option>
                        <option>Mailgun</option>
                        <option>SES</option>
                        <option>Postmark</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mail-host">Mail Host</Label>
                      <Input id="mail-host" defaultValue="smtp.example.com" />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="mail-port">Mail Port</Label>
                      <Input id="mail-port" type="number" defaultValue="587" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mail-encryption">Mail Encryption</Label>
                      <select
                        id="mail-encryption"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option>TLS</option>
                        <option>SSL</option>
                        <option>None</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Button>{t("save")}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security settings and protocols
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Password Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password Policy</h3>

                  <div className="space-y-2">
                    <Label htmlFor="min-password-length">
                      Minimum Password Length
                    </Label>
                    <Input
                      id="min-password-length"
                      type="number"
                      defaultValue="8"
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum characters required for user passwords
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="require-special-chars"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                    <Label htmlFor="require-special-chars">
                      Require special characters
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="require-numbers"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                    <Label htmlFor="require-numbers">Require numbers</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="require-uppercase"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                    <Label htmlFor="require-uppercase">
                      Require uppercase letters
                    </Label>
                  </div>
                </div>

                {/* Login Settings */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-medium">Login Settings</h3>

                  <div className="space-y-2">
                    <Label htmlFor="max-login-attempts">
                      Maximum Login Attempts
                    </Label>
                    <Input
                      id="max-login-attempts"
                      type="number"
                      defaultValue="5"
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of failed login attempts before account lockout
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lockout-time">
                      Account Lockout Time (minutes)
                    </Label>
                    <Input id="lockout-time" type="number" defaultValue="30" />
                    <p className="text-xs text-muted-foreground">
                      Duration an account remains locked after reaching maximum
                      login attempts
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="require-2fa"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="require-2fa">
                      Require two-factor authentication for all users
                    </Label>
                  </div>
                </div>

                <Button>{t("save")}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
