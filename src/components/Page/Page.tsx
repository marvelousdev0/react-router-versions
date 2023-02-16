import "./page.css";

export default function Page({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="page">
      <h1 className="heading">{title}</h1>
      {children}
    </div>
  );
}
