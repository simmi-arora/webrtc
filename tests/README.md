# Automated tests 

Linux 
chrome \
  --headless \                   # Runs Chrome in headless mode.
  --disable-gpu \                # Temporarily needed if running on Windows.
  --remote-debugging-port=9222 \
  https://www.chromestatus.com   # URL to open. Defaults to about:blank.

Mac
 /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome  --headless


Printing DOM 
```
chrome --headless --disable-gpu --dump-dom https://localhost:8084/
```

Printing DOM to pdf 
```
chrome --headless --disable-gpu --print-to-pdf https://localhost:8084/
```

Taking csreenshot 
```
chrome --headless --disable-gpu --screenshot https://localhost:8084/
```

Ref :

