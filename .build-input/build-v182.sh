#!/usr/bin/env bash
set -euo pipefail

PRIVATE_KEY="${PRIVATE_KEY:?PRIVATE_KEY is required}"
ROOT="$(pwd)"
WORK="$ROOT/v182-input"

git fetch --depth=1 origin 30179a3eb3b9395cfd3d4e3dde76b44c0f45f3b0
git worktree add "$WORK" FETCH_HEAD
cd "$WORK"
chmod +x .build-input/build-v18.sh
PRIVATE_KEY="$PRIVATE_KEY" .build-input/build-v18.sh >&2
SRC="$WORK/Corujinha-Finance-codigo-fonte"

python3 - "$SRC" <<'PY'
from pathlib import Path
import sys
root = Path(sys.argv[1])
main = root / "app/src/main/java/com/example/MainActivity.kt"
text = main.read_text()
text = text.replace(
    "import android.os.Bundle\nimport androidx.activity.compose.setContent\n",
    "import android.os.Bundle\nimport androidx.activity.compose.BackHandler\nimport androidx.activity.compose.setContent\n"
)
text = text.replace("import androidx.navigation.NavGraph.Companion.findStartDestination\n", "")
anchor = "    val isFullscreenRoute = currentRoute == NavRoutes.Splash.route || currentRoute == NavRoutes.Login.route\n\n    Scaffold(\n"
replacement = '''    val isFullscreenRoute = currentRoute == NavRoutes.Splash.route || currentRoute == NavRoutes.Login.route
    val hasOpenEditor = showTransactionDialogType != null || showAddCardDialog || showAddGoalDialog

    fun navigateToMainSection(route: String) {
        navController.navigate(route) {
            popUpTo(NavRoutes.Dashboard.route) {
                inclusive = false
                saveState = false
            }
            launchSingleTop = true
            restoreState = false
        }
    }

    BackHandler(
        enabled = !isFullscreenRoute && (hasOpenEditor || currentRoute != NavRoutes.Dashboard.route)
    ) {
        when {
            showTransactionDialogType != null -> {
                showTransactionDialogType = null
                editingTransaction = null
            }
            showAddCardDialog -> {
                showAddCardDialog = false
                editingCard = null
            }
            showAddGoalDialog -> {
                showAddGoalDialog = false
                editingGoal = null
            }
            currentRoute != NavRoutes.Dashboard.route -> navigateToMainSection(NavRoutes.Dashboard.route)
        }
    }

    Scaffold(
'''
if anchor not in text:
    raise SystemExit("navigation anchor not found")
text = text.replace(anchor, replacement)
old_click = '''                            onClick = {
                                navController.navigate(item.route) {
                                    popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
'''
if old_click not in text:
    raise SystemExit("bottom navigation anchor not found")
text = text.replace(old_click, "                            onClick = { navigateToMainSection(item.route) },\n")
text = text.replace(
    "onNavigateToTransactions = { navController.navigate(NavRoutes.Transactions.route) },",
    "onNavigateToTransactions = { navigateToMainSection(NavRoutes.Transactions.route) },"
)
text = text.replace(
    "onNavigateToAI = { navController.navigate(NavRoutes.CorujinhaAI.route) },",
    "onNavigateToAI = { navigateToMainSection(NavRoutes.CorujinhaAI.route) },"
)
main.write_text(text)

gradle = root / "app/build.gradle.kts"
build = gradle.read_text()
build = build.replace("versionCode = 9", "versionCode = 11")
build = build.replace('versionName = "1.8"', 'versionName = "1.8.2"')
gradle.write_text(build)

(root / "README-ALTERACOES-v1.8.2.txt").write_text('''CORUJA FINANCE v1.8.2 — NAVEGAÇÃO DO BOTÃO VOLTAR

1. O botão Voltar não percorre mais todas as abas visitadas.
2. Formulários e editores abertos são fechados primeiro.
3. De qualquer seção principal, Voltar leva diretamente para a tela Início.
4. Na tela Início, o próximo Voltar encerra o aplicativo pelo comportamento padrão do Android.
5. A navegação inferior não restaura pilhas antigas nem acumula telas repetidas.
6. Todas as funcionalidades e dados das versões anteriores foram preservados.

Versão: 1.8.2
Código da versão: 11
''')
PY

grep -Fq 'versionCode = 11' "$SRC/app/build.gradle.kts"
grep -Fq 'versionName = "1.8.2"' "$SRC/app/build.gradle.kts"
grep -Fq 'applicationId = "com.aistudio.corujinhafinancas.cdaccc"' "$SRC/app/build.gradle.kts"
grep -Fq 'import androidx.activity.compose.BackHandler' "$SRC/app/src/main/java/com/example/MainActivity.kt"
grep -Fq 'popUpTo(NavRoutes.Dashboard.route)' "$SRC/app/src/main/java/com/example/MainActivity.kt"
grep -Fq 'saveState = false' "$SRC/app/src/main/java/com/example/MainActivity.kt"
grep -Fq 'restoreState = false' "$SRC/app/src/main/java/com/example/MainActivity.kt"
grep -Fq 'currentRoute != NavRoutes.Dashboard.route -> navigateToMainSection(NavRoutes.Dashboard.route)' "$SRC/app/src/main/java/com/example/MainActivity.kt"
test -s "$SRC/signing/coruja-finance-release.jks"
test -s "$SRC/keystore.properties"

printf '%s\n' "$SRC"
