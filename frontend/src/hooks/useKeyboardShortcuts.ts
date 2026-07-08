import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || target.isContentEditable;
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === '/') {
        event.preventDefault();
        if (location.pathname !== '/urls') {
          navigate('/urls');
        }
        requestAnimationFrame(() => {
          document.getElementById('urls-search-input')?.focus();
        });
      }

      if (event.key === 'n') {
        event.preventDefault();
        navigate('/urls/new');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, location.pathname]);
}
