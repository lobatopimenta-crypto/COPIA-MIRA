#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
SRC="$ROOT/Corujinha-Finance-codigo-fonte"
PRIVATE_KEY="${PRIVATE_KEY:?PRIVATE_KEY is required}"

chmod +x .build-input/build-v17.sh
PRIVATE_KEY="$PRIVATE_KEY" .build-input/build-v17.sh

mkdir -p .secure-v18
base64 --decode .build-input/coruja-v18-patch-key.enc.b64 > .secure-v18/patch-key.enc
cat .build-input/coruja-v18-patch.chunk-* | base64 --decode > .secure-v18/patch.enc

echo "d1c2acfa641798a015f1ae13afde15f4f28a29013965b2ec89d1a49837da394f  .secure-v18/patch-key.enc" | sha256sum --check
echo "140bf226a249fa0f664aeab51b99511854a53ae710073b46caa835bb934e00f3  .secure-v18/patch.enc" | sha256sum --check

openssl pkeyutl -decrypt \
  -inkey "$PRIVATE_KEY" \
  -in .secure-v18/patch-key.enc \
  -pkeyopt rsa_padding_mode:oaep \
  -pkeyopt rsa_oaep_md:sha256 \
  -out .secure-v18/password.txt

openssl enc -d -aes-256-cbc -salt -pbkdf2 -iter 200000 \
  -in .secure-v18/patch.enc \
  -out .secure-v18/coruja-v18-patch.tar.xz \
  -pass file:.secure-v18/password.txt

echo "fd5d7bfe0dee60e5cb1204cc7fbf7041fd07b9d9bf3b6fc9a912773184943241  .secure-v18/coruja-v18-patch.tar.xz" | sha256sum --check
xz -t .secure-v18/coruja-v18-patch.tar.xz
tar -xJf .secure-v18/coruja-v18-patch.tar.xz -C "$SRC"

grep -Fq 'versionName = "1.8"' "$SRC/app/build.gradle.kts"
grep -Fq 'versionCode = 9' "$SRC/app/build.gradle.kts"
grep -Fq 'Valor da compra (R$)' "$SRC/app/src/main/java/com/example/ui/screens/CardsScreen.kt"
grep -Fq 'Lançar valor no cartão' "$SRC/app/src/main/java/com/example/ui/screens/CardsScreen.kt"
grep -Fq 'Informar categoria e data da compra' "$SRC/app/src/main/java/com/example/ui/screens/CardsScreen.kt"
grep -Fq 'Lançar valor de compra' "$SRC/app/src/main/java/com/example/ui/screens/AddCardPurchaseDialog.kt"
test -s "$SRC/signing/coruja-finance-release.jks"
test -s "$SRC/keystore.properties"
