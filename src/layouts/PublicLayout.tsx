import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTheme } from "../contexts/ThemeContext";

interface PublicLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  showFooter = true,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-900"
      } flex flex-col overflow-hidden relative`}
    >
      {/* Dot pattern background */}
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

      {/* Subtle radial glow */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl pointer-events-none ${
          isDarkMode ? "bg-blue-950/30" : "bg-blue-100/50"
        }`}
      />

      <Header />

      <main className="flex-grow relative z-10">{children}</main>

      {showFooter && <Footer />}
    </div>
  );
};

export default PublicLayout;
