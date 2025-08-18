import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { PocketBase } from "../pocketBase/pocketBaseHelpers";

export const AuthSignin = (p: {
  pb: PocketBase;
  onSignIn: (success: boolean, message: string) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      await p.pb.collection("users").authWithPassword(email, password);
      p.onSignIn(true, "Successfully signed in!");
    } catch (err) {
      console.error("Sign in error:", err);
      p.onSignIn(false, "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <TextInput
          value={email}
          onInput={setEmail}
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <TextInput
          value={password}
          onInput={setPassword}
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};
