type ButtonProps = {
  text: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

export default function Button({
  text,
  onClick,
  variant = "primary",
}: ButtonProps) {
  const base = "px-4 py-2 rounded font-semibold";
  const style =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <button onClick={onClick} className={`${base} ${style}`}>
      {text}
    </button>
  );
}
