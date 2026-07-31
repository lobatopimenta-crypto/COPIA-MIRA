#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
SRC="$ROOT/Corujinha-Finance-codigo-fonte"
PRIVATE_KEY="${PRIVATE_KEY:?PRIVATE_KEY is required}"

cat .build-input/coruja-v13.part00 .build-input/coruja-v13.part01 .build-input/coruja-v13.part02 .build-input/coruja-v13.part03 .build-input/coruja-v13.part04 .build-input/coruja-v13.part05 .build-input/coruja-v13.part06 .build-input/coruja-v13.part07 | base64 --decode > coruja-v13-source.tar.xz
echo "76b9ba4aee4999bf8b167056f055663873f496521412ec5c5b62a879d21d6de3  coruja-v13-source.tar.xz" | sha256sum --check
tar -xJf coruja-v13-source.tar.xz

cat .build-input/coruja-v14-patch.part00a .build-input/coruja-v14-patch.part00b .build-input/coruja-v14-patch.part01a .build-input/coruja-v14-patch.part01b .build-input/coruja-v14-patch.part02 .build-input/coruja-v14-patch.part03 | base64 --decode > coruja-v14-patch.tar.xz
echo "7a0ff60335a9c536108c9fc0aca8fcedd66122a2bc88a7b3303832bd302c23af  coruja-v14-patch.tar.xz" | sha256sum --check
tar -xJf coruja-v14-patch.tar.xz -C "$SRC"
base64 --decode .build-input/coruja-v14-components-fix.b64 > coruja-v14-components-fix.tar.xz
echo "cf702f40c5d42f5a44933313c37166eec862fe0a5a0c32d093c6fcb993d83daf  coruja-v14-components-fix.tar.xz" | sha256sum --check
tar -xJf coruja-v14-components-fix.tar.xz -C "$SRC"

cat .build-input/coruja-v15-patch.part00 .build-input/coruja-v15-patch.part01a .build-input/coruja-v15-patch.part01b0 .build-input/coruja-v15-patch.part01b10 .build-input/coruja-v15-patch.part01b110 .build-input/coruja-v15-patch.part01b111 .build-input/coruja-v15-patch.part02 .build-input/coruja-v15-patch.part03 > coruja-v15-patch.b64
echo "02483c94964d7d10bd3d22a4561709af8a543b8eec0d7e157a1af93c71d5842d  coruja-v15-patch.b64" | sha256sum --check
base64 --decode coruja-v15-patch.b64 > coruja-v15-patch.tar.xz
echo "7c9dedeacd85208c9c2894f209570d04c18c733a450e5ce745f7bf13b817bb75  coruja-v15-patch.tar.xz" | sha256sum --check
tar -xJf coruja-v15-patch.tar.xz -C "$SRC"
while IFS= read -r path; do rm -f "$SRC/$path"; done < "$SRC/delete-list.txt"
rm -f "$SRC/delete-list.txt"

cat .build-input/coruja-v16-patch.part00 .build-input/coruja-v16-patch.part01 .build-input/coruja-v16-patch.part02 .build-input/coruja-v16-patch.part03 .build-input/coruja-v16-patch.part04 .build-input/coruja-v16-patch.part05 .build-input/coruja-v16-patch.part06 > coruja-v16-patch.b64
echo "f84dc0e77021df695a029a7d4795a416bff76c895bd99f744e46b342b75e0195  coruja-v16-patch.b64" | sha256sum --check
base64 --decode coruja-v16-patch.b64 > coruja-v16-patch.tar.xz
echo "2efd26ab89b3321063c638eb853ef7dc5e3b0bccf6774c70df6bd3b2bfa6410c  coruja-v16-patch.tar.xz" | sha256sum --check
tar -xJf coruja-v16-patch.tar.xz -C "$SRC"

cat .build-input/coruja-v17-patch.part00 .build-input/coruja-v17-patch.part01 .build-input/coruja-v17-patch.part02 .build-input/coruja-v17-patch.part03 > coruja-v17-patch.b64
echo "205ca3a2e862f37acc4d2b89ae8bdcefa63177a325f32f10c43439639b220f63  coruja-v17-patch.b64" | sha256sum --check
base64 --decode coruja-v17-patch.b64 > coruja-v17-patch.tar.xz
echo "8d8a0608ec2ab640d8616e601c4a1133fe4f2f13dbd30da18ebbc268ab3a4852  coruja-v17-patch.tar.xz" | sha256sum --check
tar -xJf coruja-v17-patch.tar.xz -C "$SRC"

mkdir -p .secure
base64 --decode .build-input/coruja-v17-signing-key.enc.b64 > .secure/signing-key.enc
base64 --decode .build-input/coruja-v17-signing.enc.b64 > .secure/signing.enc
echo "46303483717af71cf3dcab2b8b91c0364d34dea865b4d8950120356969d45f54  .secure/signing-key.enc" | sha256sum --check
echo "c0c9fdbed7a872788ecce69a2d75c5487502d948531f8f5081fa92610db8567a  .secure/signing.enc" | sha256sum --check
openssl pkeyutl -decrypt -inkey "$PRIVATE_KEY" -in .secure/signing-key.enc -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256 -out .secure/password.txt
openssl enc -d -aes-256-cbc -salt -pbkdf2 -iter 200000 -in .secure/signing.enc -out .secure/signing.tar.xz -pass file:.secure/password.txt
tar -xJf .secure/signing.tar.xz -C "$SRC"

grep -Fq 'versionName = "1.7"' "$SRC/app/build.gradle.kts"
grep -Fq 'versionCode = 8' "$SRC/app/build.gradle.kts"
grep -Fq 'CreditCardPurchaseEntity' "$SRC/app/src/main/java/com/example/data/local/Entities.kt"
grep -Fq 'fun addCardPurchase' "$SRC/app/src/main/java/com/example/data/repository/FinanceRepository.kt"
grep -Fq 'Lançar compra' "$SRC/app/src/main/java/com/example/ui/screens/CardsScreen.kt"
grep -Fq 'TRANSACTION_SOURCE_CARD_INVOICE' "$SRC/app/src/main/java/com/example/data/local/Entities.kt"
test -s "$SRC/signing/coruja-finance-release.jks"
test -s "$SRC/keystore.properties"
