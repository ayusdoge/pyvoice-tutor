import { ExecutionResult } from '../types';

declare global {
  interface Window {
    loadPyodide?: any;
    pyodideInstance?: any;
  }
}

let pyodideLoadingPromise: Promise<any> | null = null;

export async function getPyodideInstance(): Promise<any> {
  if (window.pyodideInstance) {
    return window.pyodideInstance;
  }

  if (pyodideLoadingPromise) {
    return pyodideLoadingPromise;
  }

  pyodideLoadingPromise = (async () => {
    // Wait until pyodide script is loaded if needed
    if (typeof window.loadPyodide === 'undefined') {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Pyodide script from CDN'));
        document.head.appendChild(script);
      });
    }

    const pyodide = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
    });
    window.pyodideInstance = pyodide;
    return pyodide;
  })();

  return pyodideLoadingPromise;
}

export async function executePythonCode(code: string): Promise<ExecutionResult> {
  const startTime = performance.now();
  try {
    const pyodide = await getPyodideInstance();

    // Redirect standard output and error to capture in JS
    pyodide.runPython(`
import sys
import io
sys_stdout_backup = sys.stdout
sys_stderr_backup = sys.stderr
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

    let executionError: string | undefined = undefined;
    try {
      pyodide.runPython(code);
    } catch (err: any) {
      executionError = err?.message || String(err);
    }

    const stdout = pyodide.runPython(`
output = sys.stdout.getvalue()
err_output = sys.stderr.getvalue()
sys.stdout = sys_stdout_backup
sys.stderr = sys_stderr_backup
output + (("\\n[Error]: " + err_output) if err_output else "")
`);

    const endTime = performance.now();
    return {
      output: (stdout || '').trim() || (executionError ? '' : '(No output returned. Did your code call print()?)'),
      error: executionError,
      executionTimeMs: Math.round(endTime - startTime)
    };
  } catch (err: any) {
    const endTime = performance.now();
    return {
      output: '',
      error: err?.message || 'Error executing Python code in browser.',
      executionTimeMs: Math.round(endTime - startTime)
    };
  }
}
