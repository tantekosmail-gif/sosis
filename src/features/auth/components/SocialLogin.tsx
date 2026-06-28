import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SocialLogin() {
  return (
    <div className="mt-6">

      <div className="flex items-center gap-4 mb-6">
        <Separator className="flex-1" />
        <span className="text-xs text-slate-400">
          OR CONTINUE WITH
        </span>
        <Separator className="flex-1" />
      </div>

      <div className="grid grid-cols-2 gap-4">

        <Button variant="outline">
          Google
        </Button>

        <Button variant="outline">
          GitHub
        </Button>

      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don't have an account?{" "}
        <span className="font-medium text-blue-500 cursor-pointer">
          Register
        </span>
      </p>

    </div>
  );
}