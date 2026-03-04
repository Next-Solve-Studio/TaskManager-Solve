'use client'

import { useState } from "react"

export function BurgerButton({ isOpen, onClick }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <label 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'relative',
                width: '24px',        
                height: '18px',       
                background: 'transparent',
                cursor: 'pointer',
                display: 'block',
                flexShrink: 0,
                marginLeft: isOpen ? '8px' : '0',
        }}>
        <input
            type="checkbox"
            checked={isOpen}
            onChange={onClick}
            style={{ display: 'none' }}
        />
        {[0, 1, 2].map((i) => (
            <span
            key={i}
            style={{
                display: 'block',
                position: 'absolute',
                height: '2px',        
                width: '100%',
                background: isHovered ? '#ffffff' : '#6d6d6d',
                borderRadius: '9px',
                left: 0,
                transition: '.25s ease-in-out',
                ...(i === 0 && {
                top: '0px',
                transformOrigin: 'center',           // centralizado
                transform: isOpen
                    ? 'translateY(8px) rotate(45deg)'  // desce até o meio e gira
                    : 'rotate(0deg)',
                }),
                ...(i === 1 && {
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: isOpen ? 0 : 1,
                transition: '.15s ease-in-out',
                }),
                ...(i === 2 && {
                top: '100%',
                transformOrigin: 'center',            // centralizado
                transform: isOpen
                    ? 'translateY(-10px) rotate(-45deg)' // sobe até o meio e gira
                    : 'translateY(-100%)',
                }),
            }}
            />
        ))}
        </label>
    )
}