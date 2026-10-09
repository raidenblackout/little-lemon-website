import { useEffect } from 'react';

export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Little Lemon` : 'Little Lemon | Chicago';
  }, [title]);
}
