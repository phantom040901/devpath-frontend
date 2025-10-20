export default function Header({ children }) {
  return (
    <header className="dark:bg-gradient-to-bottom light:bg-gradient-to-b light:from-gray-50 light:to-white pt-10 pb-0 max-xl:pt-8 max-xl:pb-0 max-lg:pt-8 max-lg:pb-0 max-md:pt-6 max-md:pb-0 overflow-x-hidden">
      {children}
    </header>
  );
}
