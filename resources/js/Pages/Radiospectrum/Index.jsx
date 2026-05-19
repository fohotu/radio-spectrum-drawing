// resources/js/Pages/Documents/Index.jsx
import React,{useState} from "react";
import { Link,router } from "@inertiajs/react";
import { Pencil, Trash2,Plus,Search } from "lucide-react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Index({ documents,filters }) {

    const [search, setSearch] = useState(filters?.search || "");

const submitSearch = (e) => {

    e.preventDefault();

    router.get(
        "/dashboard",
        { search },
        {
            preserveState: true,
            replace: true,
        }
    );
};

    return (

        <AuthenticatedLayout
      
      header={<Header />}
    >

        <div className="p-6 max-w-7xl mx-auto">

            {/** */}
            <div className="flex items-center justify-between mb-3">

    <form  onSubmit={submitSearch} className="flex items-center gap-2">

        <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="
                bg-gray-700
                border border-gray-600
                text-white
                px-4 py-2
                outline-none
                focus:border-blue-500
                placeholder-gray-400
            "
        />

        <button
            type="submit"
            className="
                flex items-center justify-center
                w-10 h-10
                bg-gray-600 hover:bg-gray-500
                text-white
                border border-gray-500
                transition-colors
            "
        >
            <Search size={18} />
        </button>

         <button
        type="button"
        onClick={() => {

            setSearch("");

            router.get(
                "/dashboard",
                {},
                {
                    preserveState: true,
                    replace: true,
                }
            );

        }}
        className="
            flex items-center justify-center
            w-10 h-10
            bg-gray-600 hover:bg-red-500
            text-white
            border border-gray-500
            transition-colors
        "
    >
        ✕
    </button>

    </form>

    <Link
        href="/radiospectrum/create"
        className="
            flex items-center justify-center
            w-10 h-10
            bg-green-500 hover:bg-green-600
            text-white
            border border-green-400
            transition-colors
        "
    >
        <Plus size={18} />
    </Link>

</div>
           
            <div className="shadow overflow-hidden border border-gray-600">

    <table className="min-w-full border-collapse bg-gray-700">

        <thead className="bg-gray-800">

            <tr>

                <th className="border border-gray-600 px-6 py-3 text-left text-sm font-semibold text-white">
                    Название
                </th>

                <th className="border border-gray-600 px-6 py-3 text-left text-sm font-semibold text-white">
                    Группы
                </th>

                <th className="border border-gray-600 px-6 py-3 text-left text-sm font-semibold text-white">
                    Элементы
                </th>

                <th className="border border-gray-600 px-6 py-3 text-left text-sm font-semibold text-white">
                    Создано
                </th>

                <th className="border border-gray-600 px-6 py-3 text-center text-sm font-semibold text-white">
                    #
                </th>

            </tr>

        </thead>

        <tbody>

            {documents.data.length > 0 ? (

                documents.data.map((document) => (

                    <tr
                        key={document.id}
                        className="
                            transition-colors
                            hover:bg-gray-600
                        "
                    >

                        <td className="border border-gray-600 px-6 py-4 text-sm font-medium text-white">
                            {document.title}
                        </td>

                        <td className="border border-gray-600 px-6 py-4 text-sm text-white">
                            {document.groups_count}
                        </td>

                        <td className="border border-gray-600 px-6 py-4 text-sm text-white">
                            {document.elements_count}
                        </td>

                        <td className="border border-gray-600 px-6 py-4 text-sm text-white">
                            {document.created_at}
                        </td>

                        <td className="border border-gray-600 px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                                <Link
                                    href={`/radiospectrum/${document.id}/edit`}
                                    className="
                                        flex items-center justify-center
                                        w-9 h-9
                                        bg-blue-500 hover:bg-blue-600
                                        text-white
                                        transition-colors
                                    "
                                >
                                    <Pencil size={16} />
                                </Link>
                                <Link
                                    href={`/radiospectrum/${document.id}`}
                                    method="delete"
                                    as="button"
                                    className="
                                        flex items-center justify-center
                                        w-9 h-9
                                        bg-red-500 hover:bg-red-600
                                        text-white
                                        transition-colors
                                    "
                                >
                                    <Trash2 size={16} />
                                </Link>

                            </div>

                        </td>

                    </tr>

                ))

            ) : (

                <tr>

                    <td
                        colSpan="5"
                        className="
                            border border-gray-600
                            px-6 py-10
                            text-center text-gray-300
                        "
                    >
                        Документы не найдены
                    </td>

                </tr>

            )}

        </tbody>

    </table>

</div>

            <div className="flex items-center gap-2 mt-6 flex-wrap">

    {documents.links.map((link, index) => (

        <Link
            key={index}
            href={link.url || ""}
            dangerouslySetInnerHTML={{
                __html: link.label,
            }}
            className={`
                min-w-[40px]
                h-10
                px-3
                flex items-center justify-center
                border border-gray-600
                text-sm
                transition-colors

                ${link.active
                    ? "bg-gray-500 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }

                ${!link.url
                    ? "opacity-40 pointer-events-none"
                    : ""
                }
            `}
        />

    ))}

</div>
            {/** */}


        </div>

        </AuthenticatedLayout>
    );
}