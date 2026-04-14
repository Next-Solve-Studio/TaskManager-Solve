// Menu Lateral
import SideMenuItems from "./sideMenuItems/SideMenuItems";

export default function SideMenu({ isOpen, onToggle, isMobile }) {
    return (
        <aside className={` ${!isMobile ? 'w-75 pr-4 sm:pr-6' : ''}`}>
            <SideMenuItems isOpen={isOpen} onToggle={onToggle} isMobile={isMobile}/>
        </aside>
    );
}
