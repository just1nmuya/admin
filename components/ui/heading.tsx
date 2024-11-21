interface HeadingProps {
  title: string;
  description: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className="text-3xl font-semibold tracking-tight">
      <h2>{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
