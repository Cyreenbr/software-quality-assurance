import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
    const location = useLocation();
    const segments = location.pathname.split("/").filter(Boolean); // Découpe l'URL en segments

    return (
        <nav className="ml-4 text-gray-600 text-sm font-medium">
            <ul className="flex items-center space-x-2">
                <li>
                    <Link to="/" className="hover:text-indigo-600">
                        Home
                    </Link>
                </li>
                {segments.map((segment, index) => {
                    const path = `/${segments.slice(0, index + 1).join("/")}`; // Recrée l'URL jusqu'au segment actuel
                    const isLast = index === segments.length - 1;

                    return (
                        <li key={path} className="flex items-center capitalize">
                            <span className="mx-1">›</span>
                            {isLast ? (
                                <span className="text-gray-500">{decodeURIComponent(segment)}</span>
                            ) : (
                                <Link to={path} className="hover:text-indigo-600">
                                    {decodeURIComponent(segment)}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Breadcrumb;