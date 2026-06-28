export async function login(email: string, password: string) {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (
    email === "admin@mail.com" &&
    password === "password123"
  ) {
    return {
      success: true,
      user: {
        id: 1,
        name: "Administrator",
        email,
      },
    };
  }

  throw new Error("Email atau Password salah");
}