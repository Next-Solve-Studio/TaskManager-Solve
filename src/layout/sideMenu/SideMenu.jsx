// Menu Lateral
import SideMenuItems from "./sideMenuItems/SideMenuItems";

export default function SideMenu({ isOpen, onToggle, isMobile }) {
    return (
        <>
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
                    onClick={onToggle}
                    aria-hidden="true"
                />
            )}
            <aside className={` ${!isMobile ? "w-75 pr-4 sm:pr-6" : ""}`}>
                <SideMenuItems
                    isOpen={isOpen}
                    onToggle={onToggle}
                    isMobile={isMobile}
                />
            </aside>
        </>
        
    );
}
