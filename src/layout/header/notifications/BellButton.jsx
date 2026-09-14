
import { MdNotificationsNone } from 'react-icons/md';

export default function BellButton({ count, onClick }) {
  return (
          <button
              type="button"
              onClick={onClick}
              title="Notificações"
              className="sm:cursor-pointer relative w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
          >
              <MdNotificationsNone size={21} />
              {count > 0 && (
                  <span className="absolute top-1 right-1 min-w-3.5 h-3.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-black leading-none px-0.5">
                      {count > 9 ? "9+" : count}
                  </span>
              )}
          </button>
      );
}
