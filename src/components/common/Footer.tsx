const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner py-4">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Vietnamese-Chinese Learning | Learning languages together</p>
      </div>
    </footer>
  );
};

export default Footer;