
type CustomerFormProps = {
  onSubmit: (data: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  }) => void;
};

export default function CustomerForm({ onSubmit }: CustomerFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onSubmit({
      fullName: String(formData.get("fullName")),
      email: String(formData.get("email")),
      phone: String(formData.get("phone")),
      address: String(formData.get("address")),
      city: String(formData.get("city")),
    });
  };

  return (
    <form className="form-content" onSubmit={handleSubmit}>
      <h2>Add Customer</h2>

      <label>Customer Name</label>
      <input name="fullName" placeholder="Enter customer name" required />

      <label>Email</label>
      <input name="email" type="email" placeholder="Enter email" required />

      <label>Phone Number</label>
      <input name="phone" type="tel" placeholder="Enter phone number" required />

      <label>Address</label>
      <textarea name="address" placeholder="Enter address" required />

      <label>City</label>
      <input name="city" placeholder="Enter city" required />

      <button type="submit">Save Customer</button>
    </form>
  );
}
