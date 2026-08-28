import re

with open('instapay_b64.txt', 'r') as f:
    b64_str = f.read().strip()

with open('app.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Replace the broken base64 string
new_js = re.sub(
    r"const _instapayQr = 'data:image/png;base64,[^']+';",
    f"const _instapayQr = 'data:image/png;base64,{b64_str}';",
    js_content
)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(new_js)

print("Injected successfully, new size:", len(new_js))
