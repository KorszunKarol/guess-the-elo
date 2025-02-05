interface StepProps {
  number: string;
  title: string;
  description: string;
}

export function Step({ number, title, description }: StepProps) {
  return (
    <div className="flex gap-4">
      <div className="text-yellow-500 font-bold text-xl">{number}</div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}