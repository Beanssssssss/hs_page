"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase"; // Browser Client
console.log("URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10));
// --------------------------------------------------
// Form Schema
// --------------------------------------------------
const formSchema = z.object({
  email: z.string().email({ message: "유효한 이메일을 입력해주세요." }),
  password: z
    .string()
    .min(6, { message: "비밀번호는 6자 이상이어야 합니다." }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("LOGIN TRY", {
      email: values.email,
      password: values.password,
    });
    // 1️⃣ 로그인
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    console.log(error)
    
    if (error) {
      toast({
        variant: "destructive",
        title: "로그인 실패",
        description: "이메일 또는 비밀번호를 확인해주세요.",
      });
      setIsLoading(false);
      return;
    }
    console.log('there')
    // 2️⃣ 관리자 권한 확인
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .single();
    if (profileError || profile?.role !== "admin") {
      await supabase.auth.signOut();

      toast({
        variant: "destructive",
        title: "접근 권한 없음",
        description: "관리자 계정만 접근할 수 있습니다.",
      });

      setIsLoading(false);
      return;
    }

    // 3️⃣ 성공
    toast({
      title: "환영합니다!",
      description: "관리자 페이지로 이동합니다.",
    });

    router.refresh(); // 서버 컴포넌트 / 미들웨어 재실행
    router.push("/");
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">
            헤이트슬롭 관리자 로그인
          </CardTitle>
          <CardDescription className="text-center">
            관리자 계정으로만 접근 가능합니다.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@hateslop.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  "로그인"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}