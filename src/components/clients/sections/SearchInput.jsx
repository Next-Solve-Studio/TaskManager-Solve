"use client";

import { MdSearch } from "react-icons/md";


export default function SearchInput({ setSearchTerm, searchTerm }) {


    return (
        <div className="flex gap-4 items-center justify-between">
            <div className="relative max-w-150 flex-[1_1_200px]">
                <MdSearch
                        size={16}
                        style={{
                            position: "absolute",
                            left: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--color-text-muted)",
                        }}
                    />
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar parceiros ou clientes..."
                    className="shadow-sm w-full bg-bg-card border border-border-main rounded-lg p-[12px_10px_12px_32px] outline-none text-text-primary text-[13px] focus:border-brand-500 transition-colors"
                />
            </div>
        </div>
    );
}
