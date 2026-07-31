#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
SRC="$ROOT/Corujinha-Finance-codigo-fonte"

# Reconstruct the complete v1.7 source while deliberately skipping only the signing-key section.
awk '/^mkdir -p \.secure$/ { exit } { print }' .build-input/build-v17.sh > /tmp/build-v17-source-only.sh
chmod +x /tmp/build-v17-source-only.sh
/tmp/build-v17-source-only.sh

cat .build-input/coruja-v18-source.chunk-* > /tmp/coruja-v18-patch.b64
echo "6944726eda8703b488b0af73ec782fe1fa5b102faca96e35dcc151ecd1e35c4a  /tmp/coruja-v18-patch.b64" | sha256sum --check
base64 --decode /tmp/coruja-v18-patch.b64 > /tmp/coruja-v18-patch.tar.xz
echo "fd5d7bfe0dee60e5cb1204cc7fbf7041fd07b9d9bf3b6fc9a912773184943241  /tmp/coruja-v18-patch.tar.xz" | sha256sum --check
xz -t /tmp/coruja-v18-patch.tar.xz
tar -xJf /tmp/coruja-v18-patch.tar.xz -C "$SRC"

grep -Fq 'versionName = "1.8"' "$SRC/app/build.gradle.kts"
grep -Fq 'versionCode = 9' "$SRC/app/build.gradle.kts"
grep -Fq 'Lançar valor no cartão' "$SRC/app/src/main/java/com/example/ui/screens/CardsScreen.kt"
grep -Fq 'Valor da compra (R$)' "$SRC/app/src/main/java/com/example/ui/screens/CardsScreen.kt"

# Create an unsigned release only for CI. The original source remains available locally.
python3 - "$SRC/app/build.gradle.kts" <<'PY'
from pathlib import Path
import sys
p = Path(sys.argv[1])
s = p.read_text()
s = s.replace('import java.util.Properties\n\n', '')
start = s.find('val keystorePropertiesFile = rootProject.file("keystore.properties")')
if start >= 0:
    end = s.find('\nandroid {', start)
    s = s[:start] + s[end+1:]
block_start = s.find('    signingConfigs {')
if block_start >= 0:
    depth = 0
    i = block_start
    began = False
    while i < len(s):
        if s[i] == '{':
            depth += 1
            began = True
        elif s[i] == '}':
            depth -= 1
            if began and depth == 0:
                i += 1
                while i < len(s) and s[i] in '\r\n':
                    i += 1
                s = s[:block_start] + s[i:]
                break
        i += 1
s = s.replace('            signingConfig = signingConfigs.getByName("release")\n', '')
p.write_text(s)
PY
