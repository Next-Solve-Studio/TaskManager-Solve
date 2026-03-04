'use client'
import React, { useState } from 'react'
import Link from "next/link"
import { menuItems } from "./Icons"

import { BurgerButton } from './BurgerBtn';

export default function SideMenuItems() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className={`overflow-hidden h-full fixed top-0 left-0 bg-linear-to-br from-bg-card via-[#2d2d2da2] to-bg-card flex flex-col gap-5 py-10 transition-all duration-200 ease-in-out  ${isOpen ? 'w-55 items-start' : 'w-15 items-center'}  shadow-2xl`}
            
        >
            
            FOto
        <div className={`flex  w-[95%] ] ${isOpen ? ' justify-end' : 'w-15 justify-center'}`}>
               <BurgerButton  isOpen={isOpen} onClick={() => setIsOpen(prev => !prev)}/>
            </div>
            <div style={{
                width: '90%',
                height: '1px',
                background: 'rgba(255,255,255,0.07)',
                margin: '0 auto',
            }} />
            {menuItems.map ((item)=>(
                <Link
                    key={item.label}
                    href={item.href}
                    onClick={()=>setIsOpen(true)}
                    
                    className={`flex gap-4 bg-[--color-cyan-300] text-[#6d6d6d] mx-1 hover:text-white hover:bg-bg-hover w-[90%] justify-center rounded-md p-2 ${isOpen ? 'justify-start' : 'justify-center'} transition-all duration-200 ease-in-out`}
                >   
                        <item.icon
                            className={`  text-2xl transition-transform duration-200 `}
                        />
                        <span className={`text-sm  ${isOpen ? 'block ' : 'hidden'}`}>{item.label}</span>
            
                </Link>
        
            ))}
        </div>
        
    )
}
