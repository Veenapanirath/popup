
type LoginFormProps = {
  onSubmit: (data: {
    email: string;
    password: string;
  }) => void;
};

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onSubmit({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    });
  };

  return (
    <form className="form-content" onSubmit={handleSubmit}>
      <h2>Welcome Back</h2>

      <label>Email</label>
      <input
        name="email"
        type="email"
        placeholder="Enter your email"
        required
      />

      <label>Password</label>
      <input
        name="password"
        type="password"
        placeholder="Enter your password"
        required
      />

      <button type="submit">Login</button>
    </form>
  );
}
