interface AuthUserMock {
  email: string;
  password: string;
  studyName: string;
  roleName: string;
  token: string;
}

const defaultUsers: AuthUserMock[] = [
  {
    email: "usuario101@gmail.com",
    password: "#Admin2025-probo!",
    studyName: "Example Study",
    roleName: "Administrador",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-usuario101",
  },
];

function generateToken(email: string): string {
  const base = btoa(`${email}-${crypto.randomUUID()}`);
  return `mock-${base}`;
}

export function findUserByCredentials(
  email: string,
  password: string
): AuthUserMock | null {
  const user = defaultUsers.find(
    (candidate) =>
      candidate.email.toLowerCase() === email.toLowerCase() &&
      candidate.password === password
  );

  if (!user) {
    return null;
  }

  return {
    ...user,
    token: generateToken(email),
  };
}

