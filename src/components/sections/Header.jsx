export default function Header({ children }) {
  return (
    <header className="dark:bg-gradient-to-bottom light:bg-gradient-to-b light:from-gray-50 light:to-white pt-10 pb-6 max-xl:pt-8 max-xl:pb-4 max-lg:pt-8 max-lg:pb-4 max-md:pt-6 max-md:pb-4 overflow-x-hidden">
      {children}
    </header>
  );
}
