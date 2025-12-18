import { Link } from "react-router-dom";
import { Book, BookA, User } from "lucide-react";

export default function SideBar() {
  return (
    <aside className="h-full bg-background border-r border-border">
      <div className="p-6">
        <Link
          to="/books"
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <BookA className="w-6 h-6" />
          <h1 className="text-xl font-semibold">Book Library Management</h1>
        </Link>
      </div>

      <nav className="px-3 mt-8">
        <ul className="space-y-2">
          <li>
            <Link
              to="/books"
              className="flex items-center gap-4 px-4 py-3 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Book className="w-5 h-5" />
              <span className="text-base font-medium">Books</span>
            </Link>
          </li>
          <li>
            <Link
              to="/authors"
              className="flex items-center gap-4 px-4 py-3 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="text-base font-medium">Authors</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
