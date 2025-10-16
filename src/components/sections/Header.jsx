export default function Header({ children }) {
  return (
    <header className="dark:bg-gradient-to-bottom light:bg-gradient-to-b light:from-gray-50 light:to-white py-10 max-xl:py-8 max-lg:pb-24 max-md:pt-6 max-md:pb-24 overflow-x-hidden">
      {children}
    </header>
  );
}
