import "./globals.css";

export const metadata = {
  title: "CrackCode | AI Competitive Programming Companion",
  description: "AI-powered Socratic debugger and algorithm visualizer for competitive programming students.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
