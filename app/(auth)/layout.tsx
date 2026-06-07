export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ minHeight: '100dvh', background: '#000', color: '#fff' }}>{children}</div>;
}
