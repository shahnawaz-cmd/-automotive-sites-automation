# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: global_case_verification.spec.ts >> TC_13 Global Exit Intent Preview Verification
- Location: tests/global_case_verification.spec.ts:180:5

# Error details

```
Error: browserType.launch: Target page, context or browser has been closed
Browser logs:

<launching> /home/runner/.cache/ms-playwright/webkit-2311/pw_run.sh --inspector-pipe --headless --no-startup-window
<launched> pid=3024
[pid=3024][err] /home/runner/.cache/ms-playwright/webkit-2311/minibrowser-wpe/bin/MiniBrowser: error while loading shared libraries: libwoff2dec.so.1.0.2: cannot open shared object file: No such file or directory
Call log:
  - <launching> /home/runner/.cache/ms-playwright/webkit-2311/pw_run.sh --inspector-pipe --headless --no-startup-window
  - <launched> pid=3024
  - [pid=3024][err] /home/runner/.cache/ms-playwright/webkit-2311/minibrowser-wpe/bin/MiniBrowser: error while loading shared libraries: libwoff2dec.so.1.0.2: cannot open shared object file: No such file or directory
  - [pid=3024] <gracefully close start>
  - [pid=3024] <kill>
  - [pid=3024] <will force kill>
  - [pid=3024] exception while trying to kill process: Error: kill ESRCH
  - [pid=3024] <process did exit: exitCode=127, signal=null>
  - [pid=3024] starting temporary directories cleanup
  - [pid=3024] finished temporary directories cleanup
  - [pid=3024] <gracefully close end>

```