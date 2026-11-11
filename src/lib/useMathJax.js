import { useEffect, useRef } from 'react';

let queue = Promise.resolve();
export function useMathJax(dependency) {
  const root = useRef(null);
  useEffect(() => {
    let cancelled = false;
    const typeset = () => {
      const mathjax = window.MathJax;
      const element = root.current;
      if (cancelled || !element || typeof mathjax?.typesetPromise !== 'function') return;
      // Always serialize MathJax calls: fast navigation must not race the renderer.
      queue = queue.catch(() => {}).then(() => {
        if (!cancelled && root.current === element) return mathjax.typesetPromise([element]);
      }).catch(err => console.warn('MathJax:', err));
    };
    typeset();
    window.addEventListener('mathjax-ready', typeset);
    return () => { cancelled = true; window.removeEventListener('mathjax-ready', typeset); };
  }, [dependency]);
  return root;
}
